import {Component, OnInit} from '@angular/core';
import {WebsocketService} from '@app/core';
import {Observable} from 'rxjs';
import {environment as env} from '@env/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  wsConnections$: Observable<number>;
  wsMessagesIncomingCount$: Observable<number>;
  wsMessagesOutcomingCount$: Observable<number>;

  wsUrl = env.wsUrl;
  httpUrl = env.serverHost + ':' + env.serverPort;
  constructor(private wsService: WebsocketService) {
  }

  ngOnInit() {
    this.wsConnections$ = this.wsService.on<number>('connections');
    this.wsMessagesIncomingCount$ = this.wsService.messagesIncomingCount$;
    this.wsMessagesOutcomingCount$ = this.wsService.messagesOutcomingCount$;

    this.wsService.onReady()
        .subscribe(() => {
          this.wsService.send('connections');
        });
  }

}
