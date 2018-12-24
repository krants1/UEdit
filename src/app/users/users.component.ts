import {Component} from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent {

  links = [
    {link: 'data', label: 'app.menu.users.data'},
    {link: 'big-data', label: 'app.menu.users.big-data'},
    {link: 'cards', label: 'app.menu.users.cards'}
  ];

}
