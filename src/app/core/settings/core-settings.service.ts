import {Injectable, OnDestroy} from '@angular/core';
import {SubscriptionLike, BehaviorSubject} from 'rxjs';
import {skip} from 'rxjs/operators';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {DefaultCoreSettings, CoreSettings} from '@app/core/settings/core-settings.model';

type CallbackSaveFunction = (settings: CoreSettings) => void;

@Injectable()
export class CoreSettingsService implements OnDestroy {
  STORAGE_KEY = 'LOCAL_SETTINGS';
  private settingsSub: SubscriptionLike;
  public settings$: BehaviorSubject<CoreSettings>;
  constructor(private localStorage: LocalStorageService) {
    console.log('Create CoreSettingsService');
    let ds: CoreSettings = this.localStorage.getItem(this.STORAGE_KEY);
    ds = (ds == null) ? DefaultCoreSettings : Object.assign(DefaultCoreSettings, ds);

    this.settings$ = new BehaviorSubject<CoreSettings>(ds);
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

  public get current(): CoreSettings {
    return this.settings$.value;
  }
}
