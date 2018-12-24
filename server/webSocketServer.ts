import * as WebSocket from 'ws';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import * as http from 'http';
import {HTTPServer} from './httpServer';

class WsMessage {
  conn: any;
  event: string;
  data: any;
}

export class WebSocketServer {
  public wsServer: WebSocket.Server;
  public routes: Array<WebSocketRouter> = [];
  private message$: Subject<WsMessage>;
  private httpServer = http.createServer();
  constructor(private appHTTPServer: HTTPServer) {
    this.message$ = new Subject<WsMessage>();
    this.wsServer = new WebSocket.Server({server: this.httpServer});
    this.httpServer.on('request', appHTTPServer.express);
    this.routes.push(new ServerWSServerRouter(this));
    this.init();
  }

  public on(event: string): Observable<WsMessage> {
    console.log('ws on:', event);
    if (event) {
      return this.message$.pipe(
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
    /*
    this.wsServer.on('listening', () => {
      console.log('WebSocket listen port:', this.appHTTPServer.port);
    });
    */

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
        this.message$.next(wsMessage);
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

    // start listen ws via http server
    this.httpServer.listen(this.appHTTPServer.port, function () {
      console.log(`ws/http server start listening`);
    });
  }

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
