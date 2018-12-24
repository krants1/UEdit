import {Injectable, OnDestroy} from '@angular/core';
import {Observable, SubscriptionLike, Subject, Observer, interval, BehaviorSubject} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
import {share, distinctUntilChanged, takeWhile} from 'rxjs/operators';
import {environment} from '@env/environment';

interface IWsMessage {
  event: string;
  data: any;
  error: string;
}

@Injectable({
  providedIn: 'root'
})

export class WebsocketService implements OnDestroy {

  private config: WebSocketSubjectConfig<IWsMessage>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  private reconnection$: Observable<number>;
  private websocket$: WebSocketSubject<IWsMessage>;
  private connection$: Observer<boolean>;
  private wsMessages$: Subject<IWsMessage>;

  private reconnectInterval: number;
  private reconnectAttempts: number;
  private isConnected = false;

  public status: Observable<boolean>;
  private connectSubject: BehaviorSubject<boolean>;
  public messagesIncomingCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  public messagesOutcomingCount$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {
    this.wsMessages$ = new Subject<IWsMessage>();
    this.connectSubject = new BehaviorSubject<boolean>(false);

    this.reconnectInterval = environment.wsReconnectInterval || 3000;
    this.reconnectAttempts = environment.wsReconnectAttempts || 5;
    console.log('ws reconnectInterval', this.reconnectInterval);
    console.log('ws reconnectAttempts', this.reconnectAttempts);

    this.config = {
      url: environment.wsUrl,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: (event: Event) => {
          this.reconnection$ = null;
          console.log('WebSocket connected!');
          this.connection$.next(true);
        }
      }
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status
                         .subscribe((isConnected) => {
                           this.isConnected = isConnected;
                           this.connectSubject.next(this.isConnected);
                           if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
                             this.reconnect();
                           }
                         });

    this.websocketSub = this.wsMessages$.subscribe(
      null, (error: ErrorEvent) => console.error('WebSocket error!', error)
    );

    this.connect();
  }

  ngOnDestroy() {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);
    this.messagesIncomingCount$.next(0);
    this.messagesOutcomingCount$.next(0);

    this.websocket$.subscribe(
      (message) => {
        this.messagesIncomingCount$.next(this.messagesIncomingCount$.value + 1);
        console.log('ws message:', message, typeof message.data);
        this.wsMessages$.next(message);
      },
      (error: Event) => {
        console.log('ws error:', error);
        if (!this.websocket$) {
          // run reconnect if errors
          this.reconnect();
        }
      });
  }

  private reconnect(): void {
    if (this.reconnection$) {
      return;
    }

    console.log('ws reconnect Start');
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => {
        return index < this.reconnectAttempts && (this.reconnection$ != null);
      }));

    this.reconnection$.subscribe(
      () => {
        console.log('ws reconnect..');
        this.connect();
      },
      null,
      () => {
        console.log('ws reconnect End');
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$.complete();
        }
      });
  }

  public onReady(): Observable<boolean> {
    return this.connectSubject.pipe(filter(value => value === true));
    // return this.status.pipe(filter(value => value === true));
  }

  public getData<T>(event: string, data: any, callback: (data: T) => any, error: (err: any) => any = null) {
    this.wsMessages$.pipe(
      filter((message: IWsMessage) => message.event === event),
      first())
        .subscribe((mess: IWsMessage) => {
          if (mess.error) {
            if (error) {
              error(mess.error);
            }
          } else {
            callback(mess.data);
          }
        });
    this.send(event, data);
    /*
        this.onOnce(event)
            .subscribe(callback);
        this.send(event, data);
        */
  }

  public onOnce<T>(event: string): Observable<T> {
    return this.on<T>(event)
               .pipe(first());
  }

  public on<T>(event: string): Observable<T> {
    return this.wsMessages$.pipe(
      filter((message: IWsMessage) => message.event === event),
      map((message: IWsMessage) => message.data)
    );
  }

  public send(event: string, data: any = {}): void {
    if (event && this.isConnected) {
      this.messagesOutcomingCount$.next(this.messagesOutcomingCount$.value + 1);
      console.log('ws send:', event, data);
      this.websocket$.next(<any>JSON.stringify({event, data}));
    } else {
      console.error('Send error!', event, this.isConnected);
    }
  }
}
