import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ApiService} from '../api.service';

import {User} from './user.model';
import {Router} from '@angular/router';
import {WebsocketService} from '../websocket/websocket.service';
import {SubscriptionLike} from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: `users.component.html`
})

export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  modalDeleteUser = false;
  modalEditUser = false;
  editUser: User = new User();
  eventEditUserSub: SubscriptionLike;
  eventDeleteUserSub: SubscriptionLike;
  eventAddUserSub: SubscriptionLike;
//  timerShowLoading: NodeJS.Timer;

  constructor(private apiService: ApiService, private router: Router, private wsService: WebsocketService) {
  }

  ngOnDestroy() {
    this.eventEditUserSub.unsubscribe();
    this.eventDeleteUserSub.unsubscribe();
    this.eventAddUserSub.unsubscribe();
  }

  gridRefresh(fullRefresh: boolean = true) {
    //  this.timerShowLoading = setTimeout(() => this.loading = true, 500);

    this.wsService.getData<User[]>('users.get', {}, (data) => {
        if (fullRefresh) {
          this.users = [];
          /*
          this.columns.forEach(column => {
            column.sortOrder = ClrDatagridSortOrder.UNSORTED;
            column.updateFilterValue = '';
          });
          */
        }
        this.users = data;
        //  clearTimeout(this.timerShowLoading);
        this.loading = false;
      },
      err => console.log(err));

    // http
    /*
    this.apiService.getAllUsers()
        .subscribe(
          data => {
            if (fullRefresh) {
              this.users = [];
              this.columns.forEach(column => {
                column.sortOrder = ClrDatagridSortOrder.UNSORTED;
                column.updateFilterValue = '';
              });
            }

            this.users = data;
            //  clearTimeout(this.timerShowLoading);
            this.loading = false;
          },
          err => console.log(err),
          () => console.log('refresh completed')
        );
        */
  }

  ngOnInit() {
    this.wsService.onReady()
        .subscribe(() => {
          this.gridRefresh();
          // AutoSynch
          this.eventAddUserSub =
            this.wsService.on<number>('user.event.add')
                .subscribe((id) => {
                  console.log('user.event.add', id);
                  this.wsService.getData<User>('user.get', id, (user) => {
                    console.log('user data(ws):', user);
                    if (user === null) {
                      console.error('User NotFound', user);
                    } else {
                      this.users.push(user);
                    }
                  });
                });
          this.eventEditUserSub =
            this.wsService.on<number>('user.event.edit')
                .subscribe((id) => {
                  console.log('user.event.edit', id);
                  this.wsService.getData<User>('user.get', id, (user) => {
                    console.log('user data(ws):', user);
                    if (user === null) {
                      console.error('User NotFound', user);
                    } else {
                      const index = this.users.findIndex(u => u.id === id);
                      if (index >= 0) {
                        this.users[index] = user;
                      }
                    }
                  });
                });
          this.eventDeleteUserSub =
            this.wsService.on<number>('user.event.delete')
                .subscribe((id) => {
                  console.log('user.event.delete', id);
                  const index = this.users.findIndex(u => u.id === id);
                  if (index >= 0) {
                    this.users.splice(index, 1);
                  }
                });
        });
  }

  addUser() {
    window.open('/user');
  }

  onEdit(user: User) {
    window.open('/user/' + user.id.toString());
  }

  onModalEdit(user: User) {
    this.editUser = user;
    this.modalEditUser = true;
  }

  onDelete(user: User) {
    this.wsService.getData<User>('user.delete', user.id, (data) => {
      console.log('edit user result(ws):', data);
      // this.users.splice(this.users.indexOf(user), 1);
    }, err => console.log(err));

    // http
    /*
    this.apiService.deleteUser(user.id)
        .subscribe(data => {
            this.users.splice(this.users.indexOf(user), 1);
          },
          err => console.log(err),
          () => console.log('delete completed')
        );
     */
  }

  onConfirmDelete(user: User) {
    this.editUser = user;
    this.modalDeleteUser = true;
  }

}
