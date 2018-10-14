import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RightType, User} from './user.model';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {WebsocketService} from '../websocket/websocket.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: 'edit-user.component.html'
})

export class EditUserComponent implements OnInit, OnDestroy {
  @Input() userId: number;
  errorMsg = '';
  editTitle: string;
  subscription: Subscription;
  user: User = new User();
  rightTypes: RightType[] = [];
  newUserMode = false;

  constructor(private apiService: ApiService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private wsService: WebsocketService) {
    this.subscription = activateRoute.params.subscribe(params => this.userId = params['id']);
  }

  refresh() {
    if (this.newUserMode) {
      return;
    }
    this.wsService.getData<User>('user.get', this.userId, (data) => {
      console.log('user data(ws):', data);
      if (data === null) {
        this.handleError(new Error('User NotFound'));
      } else {
        this.user = data;
      }
    });

    // http
    /*
    this.apiService.getUser(this.userId)
        .subscribe(
          data => {
            console.log('data:', data);
            if (data === null) {
              this.handleError(new Error('User NotFound'));
            } else {
              this.user = data;
            }
          },
          err => this.handleError(err),
          () => console.log('refresh completed')
        );
        */

  }

  ngOnDestroy() {
  }

  ngOnInit() {
    // console.log('ngOnInit', 'EditUserComponent');
    this.newUserMode = !(this.userId);
    if (this.newUserMode) {
      this.editTitle = 'New user';
    } else {
      this.editTitle = `Edit user(Id: ${this.userId})`;
    }

    this.wsService.onReady()
        .subscribe(() => {
            console.log('wsService.onReady');
            this.wsService.getData<RightType[]>('right-types', {}, (data) => {
              this.rightTypes = data;
              this.refresh();
            });
          }
        );

    // http
    /*
    this.apiService.getUserRightTypes()
        .subscribe(
          data => {
            this.rightTypes = data;
            console.log(data);
          },
          err => this.handleError(err),
          () => {
            console.log('getUserRightTypes() completed');
            this.refresh();
          }
        );
        */
  }

  handleError(err: Error) {
    console.log('error:', err);
    let errMsg = '';
    function errAppend(mess: string) {
      errMsg += '<div>' + mess + '</div>';
    }
    errAppend(err.name);
    errAppend(err.message);
    if (err instanceof HttpErrorResponse) {
      errAppend(err.error.name);
    }
    this.errorMsg = errMsg;
  }

  save() {
    if (this.newUserMode) {
      this.wsService.getData<User>('user.add', this.user, (data) => {
        console.log('add user result(ws):', data);
        this.router.navigate(['/user', data['id']]);
      }, err => this.handleError(new Error(err)));
    } else {
      this.wsService.getData<User>('user.edit', this.user, (data) => {
        console.log('edit user result(ws):', data);
        this.refresh();
      }, err => this.handleError(new Error(err)));
    }
  }

  // http
  /*
  save() {
    if (this.newUserMode) {
      this.apiService.addUser(this.user)
          .subscribe(data => {
              console.log(data);
              this.router.navigate(['/user', data['id']]);
            },
            err => this.handleError(err),
            () => console.log('addUser() completed')
          );
    } else {
      this.apiService.updateUser(this.user.id, this.user)
          .subscribe(data => {
              this.refresh();
            },
            err => this.handleError(err),
            () => console.log('updateUser() completed')
          );
    }
  }
  */
}
