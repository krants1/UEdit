import browser from 'browser-detect';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {
  routeAnimations,
  LocalStorageService, WebsocketService, PanelClasses
} from '@app/core';
import {environment as env} from '@env/environment';
import {CoreSettingsObsrvablesService} from '@app/core/settings/core-settings-obsrvables.service';
import {CoreSettingsService} from '@app/core/settings/core-settings.service';
import {LanguageList} from '@app/core/settings/core-settings.model';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})

export class AppComponent implements OnInit {
  isProd = env.production;
  appName = env.appName;
  envName = env.envName;
  version = env.appVersion;
  year = new Date().getFullYear();
  logo = require('../assets/logo.png');
  languages = LanguageList;
  navigation = [
    {link: 'users', label: 'app.menu.users'},
    {link: 'map', label: 'app.menu.map'},
    {link: 'about', label: 'app.menu.about'}
  ];
  navigationSideMenu = [
    ...this.navigation,
    {link: 'settings', label: 'app.menu.settings'}
  ];

  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  wsSnackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(
    private settingsService: CoreSettingsService,
    private settingsObsrvablesService: CoreSettingsObsrvablesService,
    private storageService: LocalStorageService,
    private snackBar: MatSnackBar,
    private websocketService: WebsocketService) {
  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.settingsService.save(settings => settings.pageAnimationsDisabled = true);
    }

    this.stickyHeader$ = this.settingsObsrvablesService.stickyHeaderChange();
    this.language$ = this.settingsObsrvablesService.languageChange();
    this.theme$ = this.settingsObsrvablesService.themeChange();

    this.websocketService.status.subscribe(connected => {
      if (!connected) {
        this.wsSnackBarRef = this.snackBar.open('Server is not available!', 'Reload', {
          duration: 10000,
          panelClass: PanelClasses.Error
        });
        this.wsSnackBarRef.onAction()
            .subscribe(() => {
              window.location.reload();
            });
      } else if (this.wsSnackBarRef) {
        this.wsSnackBarRef.dismiss();
      }
    });
  }

  onLanguageSelect({value: language}) {
    this.settingsService.save(settings => settings.language = language);
  }
}
