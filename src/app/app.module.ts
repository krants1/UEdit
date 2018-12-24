import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {SharedModule} from '@app/shared';
import {CoreModule} from '@app/core';

import {CoreSettingsModule} from './core/settings/core-settings.module';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';

import {AppComponents, AppEntryComponents, AppModules, AppRoutes, AppServices} from './app.routes';

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,
    CoreSettingsModule,

    // app
    ...AppModules,
    RouterModule.forRoot(AppRoutes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  entryComponents: [...AppEntryComponents],
  declarations: [AppComponent, ...AppComponents],
  providers: [...AppServices],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
