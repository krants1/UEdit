import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

export enum PanelClasses {
  Default = 'default-notification-overlay',
  Info = 'info-notification-overlay',
  Success = 'success-notification-overlay',
  Warning = 'warning-notification-overlay',
  Error = 'error-notification-overlay'
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone
  ) {
  }

  default(message: string) {
    this.show(message, {
      duration: 2000,
      panelClass: PanelClasses.Default
    });
  }

  info(message: string) {
    this.show(message, {
      duration: 2000,
      panelClass: PanelClasses.Info
    });
  }

  success(message: string) {
    this.show(message, {
      duration: 2000,
      panelClass: PanelClasses.Success
    });
  }

  warn(message: string) {
    this.show(message, {
      duration: 2500,
      panelClass: PanelClasses.Warning
    });
  }

  error(message: string, duration: number = 3000) {
    this.show(message, {
      duration: duration,
      panelClass: PanelClasses.Error
    });
  }

  private show(message: string, configuration: MatSnackBarConfig) {
    // Need to open snackBar from Angular zone to prevent issues with its position per
    // https://stackoverflow.com/questions/50101912/snackbar-position-wrong-when-use-errorhandler-in-angular-5-and-material
    this.zone.run(() => this.snackBar.open(message, null, configuration));
  }
}
