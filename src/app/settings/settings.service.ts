import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, SubscriptionLike} from 'rxjs';
import {LocalStorageService} from '@app/core';

import {DefaultSettings, Settings} from '@app/settings/settings.model';
import {skip} from 'rxjs/operators';

type CallbackSaveFunction = (settings: Settings) => void;

@Injectable()
export class SettingsService implements OnDestroy {
  STORAGE_KEY = 'APP_SETTINGS';
  private settingsSub: SubscriptionLike;
  private settings$: BehaviorSubject<Settings>;

  constructor(private localStorage: LocalStorageService) {
    console.log('Create CoreSettingsService');
    let ds: Settings = this.localStorage.getItem(this.STORAGE_KEY);
    ds = (ds == null) ? DefaultSettings : Object.assign(DefaultSettings, ds);

    this.settings$ = new BehaviorSubject<Settings>(ds);
    this.settingsSub = this.settings$.pipe(skip(1))
                           .subscribe(value => {
                             localStorage.setItem(this.STORAGE_KEY, value);
                           });
  }

  ngOnDestroy(): void {
    this.settingsSub.unsubscribe();
  }

  public save(callback: CallbackSaveFunction) {
    const settings = this.settings$.value;
    callback(settings);
    this.settings$.next(settings);
  }

  public get current(): Settings {
    return this.settings$.value;
  }
}
