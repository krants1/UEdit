import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/api/api.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from '@app/api/user.model';
import {DeleteUserDialogComponent, UserDialogComponent} from '@app/users/dialogs/dialogs.comonent';
import {filter} from 'rxjs/operators';
import {Subject, SubscriptionLike} from 'rxjs';
import {WebsocketService} from '@app/core';
import {SettingsService} from '@app/settings/settings.service';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['../users.component.css']
})

export class UsersDataComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'name', 'rightType.name', 'email', 'comment', 'createdAt', 'actions'];

  usersDataSource = new MatTableDataSource<User>();

  isDataLoading = false;
  isErrorOnGettingData = false;
  isRunTimeUpdates = false;

  eventEditUserSub: SubscriptionLike = new Subject();
  eventDeleteUserSub: SubscriptionLike = new Subject();
  eventAddUserSub: SubscriptionLike = new Subject();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService,
              private settings: SettingsService,
              private wsService: WebsocketService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.isRunTimeUpdates = this.settings.current.usersRunTimeUpdates;
    this.subscribleOnUsersChanges(this.isRunTimeUpdates);
    this.usersDataSource.paginator = this.paginator;
    this.usersDataSource.sort = this.sort;
    this.usersDataSource.data = [];
    this.resfreshData();
  }

  rereshDataSource() {
    this.usersDataSource.paginator = this.paginator;
  }

  resfreshData() {
    this.isDataLoading = true;
    this.apiService.getAllUsers()
        .subscribe(
          data => {
            this.usersDataSource.data = data;
            this.isDataLoading = false;
            this.isErrorOnGettingData = false;
          },
          () => {
            this.isErrorOnGettingData = true;
            this.isDataLoading = false;
            this.usersDataSource.data = [];
          }
        );
  }

  onRefreshClick() {
    this.resfreshData();
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim()
                                             .toLowerCase();

    if (this.usersDataSource.paginator) {
      this.usersDataSource.paginator.firstPage();
    }
  }

  onDeleteUserClick(user: User) {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {data: user});

    dialogRef.afterClosed()
             .pipe(filter(value => value))
             .subscribe(id => {
               this.apiService.deleteUser(id)
                   .pipe(filter(value => !this.isRunTimeUpdates))
                   .subscribe(() => this.resfreshData()
                   );
             });
  }

  onEditUserClick(userId: number) {
    const dialogRef = this.dialog.open(UserDialogComponent, {data: userId});

    dialogRef.afterClosed()
             .pipe(filter(value => value))
             .subscribe(user => {
               this.apiService.updateUser(user)
                   .pipe(filter(value => !this.isRunTimeUpdates))
                   .subscribe(() => this.resfreshData()
                   );
             });
  }

  onAddUserClick() {
    const dialogRef = this.dialog.open(UserDialogComponent, {data: 0});

    dialogRef.afterClosed()
             .pipe(filter(value => value))
             .subscribe(user => {
               this.apiService.addUser(user)
                   .pipe(filter(value => !this.isRunTimeUpdates))
                   .subscribe(() => this.resfreshData()
                   );
             });
  }

  onRunTimeUpdatesToggle() {
    this.settings.save(settings => settings.usersRunTimeUpdates = this.isRunTimeUpdates);
    this.subscribleOnUsersChanges(this.isRunTimeUpdates);
  }

  subscribleOnUsersChanges(value: boolean) {

    this.eventEditUserSub.unsubscribe();
    this.eventDeleteUserSub.unsubscribe();
    this.eventAddUserSub.unsubscribe();

    if (value) {
      this.wsService.onReady()
          .subscribe(() => {
            this.eventAddUserSub =
              this.wsService.on<number>('user.event.add')
                  .subscribe((id) => {
                    this.apiService.getUser(id)
                        .subscribe(
                          user => {
                            if (user === null) {
                              console.error('User NotFound', id);
                            } else {
                              this.usersDataSource.data.push(user);
                              this.rereshDataSource();
                            }
                          }
                        );
                  });
            this.eventEditUserSub =
              this.wsService.on<number>('user.event.edit')
                  .subscribe((id) => {
                    this.apiService.getUser(id)
                        .subscribe(
                          user => {
                            if (user === null) {
                              console.error('User NotFound', id);
                            } else {
                              const index = this.usersDataSource.data.findIndex(u => u.id === user.id);
                              if (index >= 0) {
                                this.usersDataSource.data[index] = user;
                                this.rereshDataSource();
                              }
                            }
                          }
                        );
                  });

            this.eventDeleteUserSub =
              this.wsService.on<number>('user.event.delete')
                  .subscribe((id: number) => {
                    const index = this.usersDataSource.data.findIndex(u => u.id === id);
                    if (index >= 0) {
                      this.usersDataSource.data.splice(index, 1);
                      this.rereshDataSource();
                    }
                  });
          });
    }
  }
  ngOnDestroy(): void {
    this.subscribleOnUsersChanges(false);
  }

}
