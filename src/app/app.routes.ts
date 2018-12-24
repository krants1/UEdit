import {Routes} from '@angular/router';

import {CoreSettingsComponent} from './core/settings/components/core-settings.component';
import {AboutComponent} from '@app/about/about.component';
import {MapComponent} from '@app/map/map.component';
import {UsersDataComponent} from '@app/users/users-data/users-data.component';
import {UsersComponent} from '@app/users/users.component';
import {ApiService} from '@app/api/api.service';
import {UsersBigDataComponent} from '@app/users/users-big-data/users-big-data.component';
import {LoadingProcessComponent} from '@app/shared/loading-process/loading-process.component';
import {DeleteUserDialogComponent, UserDialogComponent} from '@app/users/dialogs/dialogs.comonent';
import {SettingsService} from '@app/settings/settings.service';
import {UsersCardsComponent} from '@app/users/users-cards/users-cards.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

export const AppModules = [InfiniteScrollModule];
export const AppEntryComponents = [DeleteUserDialogComponent, UserDialogComponent];
export const AppComponents = [AboutComponent, MapComponent, UsersComponent, UsersDataComponent, UsersBigDataComponent,
  LoadingProcessComponent, UsersCardsComponent, NotFoundComponent, ...AppEntryComponents];
export const AppServices = [ApiService, SettingsService];

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: CoreSettingsComponent,
    data: {title: 'app.menu.settings'}
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {title: 'app.menu.about'}
  },
  {
    path: 'map',
    component: MapComponent,
    data: {title: 'app.menu.map'}
  },
  {
    path: 'users',
    component: UsersComponent,
    data: {title: 'app.menu.users'},
    children: [
      {path: '', redirectTo: 'data', pathMatch: 'full'},
      {
        path: 'data',
        component: UsersDataComponent,
        data: {title: 'app.menu.users.data'}
      },
      {
        path: 'big-data',
        component: UsersBigDataComponent,
        data: {title: 'app.menu.users.big-data'}
      },
      {
        path: 'cards',
        component: UsersCardsComponent,
        data: {title: 'app.menu.users.cards'}
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
