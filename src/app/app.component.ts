import {Component} from '@angular/core';
import {WebsocketService} from './websocket/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UEditor';
  wsErrStatus = false;
  wsComplete = false;
  wsReconnectText = 'Server is not available!';
  constructor(private wsService: WebsocketService) {
    wsService.status.subscribe(value => this.wsErrStatus = !value,
      null,
      () => this.wsComplete = true);
  }
  reloadPage() {
    window.location.reload();
  }
}
