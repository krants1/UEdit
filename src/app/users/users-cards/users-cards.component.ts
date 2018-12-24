import {Component, OnInit} from '@angular/core';
import {ApiService} from '@app/api/api.service';
import {User} from '@app/api/user.model';
import {NotificationService} from '@app/core';

@Component({
  selector: 'app-users-cards',
  templateUrl: './users-cards.component.html',
  styleUrls: ['./users-cards.component.css']
})
export class UsersCardsComponent implements OnInit {
  users: User[] = [];
  isDataLoading = false;

  constructor(private notificationService: NotificationService,
              private apiService: ApiService) {

  }

  ngOnInit() {
    this.onFetch();
  }

  onFetch() {
    console.log('onFetch');
    this.isDataLoading = true;
    this.apiService.getUsers(this.users.length, 30)
        .subscribe(
          data => {
            this.isDataLoading = false;
            this.users.push(...data.items);
          },
          () => {
            this.isDataLoading = false;
          }
        );
  }

  onThumbsUpClick(user: User) {
    this.notificationService.success(`Like user ${user.name}`);
  }
  onThumbsDownClick(user: User) {
    this.notificationService.warn(`Dislike user ${user.name}`);
  }
}
