import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {RightType, User} from '@app/api/user.model';
import {ApiService} from '@app/api/api.service';
import {NotificationService} from '@app/core';

@Component({
  selector: 'app-delete-user.dialog',
  templateUrl: 'delete-user-dialog.comonent.html',
  styleUrls: ['dialogs.component.css']
})
export class DeleteUserDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User) {
  }

}

@Component({
  selector: 'app-user.dialog',
  templateUrl: 'user-dialog.comonent.html',
  styleUrls: ['dialogs.component.css']
})

export class UserDialogComponent implements OnInit {
  passHide = true;
  editTitle: string;
  newUserMode = false;
  user: User = new User();
  rightTypes: RightType[] = [];
  constructor(private apiService: ApiService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<UserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private userId: number) {
  }
  ngOnInit(): void {
    this.newUserMode = !(this.userId);
    if (this.newUserMode) {
      this.editTitle = 'New user';
    } else {
      this.editTitle = `Edit user(Id: ${this.userId})`;
    }

    this.apiService.getUserRightTypes()
        .subscribe(
          data => {
            this.rightTypes = data;
            this.refresh();
          }
        );
  }

  private refresh() {
    if (this.newUserMode) {
      return;
    }
    this.apiService.getUser(this.userId)
        .subscribe(
          data => {
            if (data === null) {
              this.notificationService.error(`User ${this.userId} not found!`);
              this.dialogRef.close();
            } else {
              this.user = data;
            }
          }
        );
  }

}
