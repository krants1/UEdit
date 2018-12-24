import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '@env/environment';

import { httpInterceptorProviders } from './http-interceptors';
import { LocalStorageService } from './local-storage/local-storage.service';
import { AnimationsService } from './animations/animations.service';
import { TitleService } from './title/title.service';
import { AppErrorHandler } from './error-handler/app-error-handler.service';
import { NotificationService } from './notifications/notification.service';
import { CoreSettingsService } from '@app/core/settings/core-settings.service';
import { CoreSettingsObsrvablesService } from '@app/core/settings/core-settings-obsrvables.service';
import {WebsocketService} from '@app/core/websocket/websocket.service';

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // 3rd party
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [],
  providers: [
    CoreSettingsService,
    CoreSettingsObsrvablesService,
    NotificationService,
    LocalStorageService,
    AnimationsService,
    httpInterceptorProviders,
    TitleService,
    WebsocketService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  exports: [TranslateModule]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
