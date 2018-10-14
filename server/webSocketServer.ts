import * as WebSocket from 'ws';
import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

class WsMessage {
  conn: any;
  event: string;
  data: any;
}

export abstract class WebSocketRouter {
  protected ownerWSServer: WebSocketServer;
  constructor(wsServer: WebSocketServer) {
    this.ownerWSServer = wsServer;
    this.init();
  }
  abstract init();
}

class ServerWSServerRouter extends WebSocketRouter {
  init() {
    this.ownerWSServer.on('connections')
        .subscribe(value => this.ownerWSServer.send(value.conn, 'connections', this.ownerWSServer.wsServer.clients.size));
  }
}

export class WebSocketServer {
  public wsServer: WebSocket.Server;
  private router: ServerWSServerRouter;
  private wsMessages$: Subject<WsMessage>;
  constructor(private port: number) {
    this.wsMessages$ = new Subject<WsMessage>();
    this.wsServer = new WebSocket.Server({port: port});
    this.router = new ServerWSServerRouter(this);
    this.init();
  }

  public on(event: string): Observable<WsMessage> {
    console.log('on', event);
    if (event) {
      return this.wsMessages$.pipe(
        filter((message: WsMessage) => message.event === event)
      );
    }
  }

  broadcast(event: string, data: any) {
    this.wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          event: event,
          data: data
        }));
      }
    });
  }

  send(conn, event: string, data: any) {
    conn.send(JSON.stringify({
      event: event,
      data: data,
      error: null
    }));
  }
  sendError(conn, event: string, error: string) {
    conn.send(JSON.stringify({
      event: event,
      data: null,
      error: error
    }));
  }

  init() {
    // error
    this.wsServer.on('error', (err) => {
      console.log('ws Error:', err);
    });

    // listening
    this.wsServer.on('listening', () => {
      console.log('WebSocket listen port:', this.port);
    });

    // connection
    this.wsServer.on('connection', (conn, req) => {

      this.broadcast('connections', this.wsServer.clients.size);

      const remoteAddress = req.connection.remoteAddress;
      console.log('WebSocket connection:', remoteAddress);

      // message
      conn.on('message', (msg) => {
        console.log('message', msg);
        const wsMessage: WsMessage = JSON.parse(JSON.parse(msg));
        wsMessage.conn = conn;
        this.wsMessages$.next(wsMessage);
      });

      // ping
      conn.isAlive = true;
      conn.on('pong', () => conn.isAlive = true);
      const pingTimer = () => {
        if (conn.isAlive === false) {
          return conn.terminate();
        }
        conn.isAlive = false;
        conn.ping();
      };
      const pingInterval = setInterval(pingTimer, 1000);

      conn.on('close', () => {
        console.log('disconnected:', remoteAddress);
        clearInterval(pingInterval);
        this.broadcast('connections', this.wsServer.clients.size);
      });

    });
  }

}
