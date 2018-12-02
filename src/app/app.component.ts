import {Component} from '@angular/core';
import {WebsocketService} from './websocket/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UEditor';
  logo = 'assets/logo.png';
  navigation = [
    {link: '', label: 'Home'},
    {link: 'users', label: 'Users'},
    {link: 'map', label: 'Map'},
    {link: 'about', label: 'About'}
  ];
  navigationSideMenu = [
    ...this.navigation,
    {link: 'settings', label: 'Settings'}
  ];
  year = new Date().getFullYear();

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
