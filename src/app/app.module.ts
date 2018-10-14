import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ClarityModule, ClrFormsNextModule, ClrInputContainer} from '@clr/angular';
import {RouterModule, Routes} from '@angular/router';

import {UsersComponent} from './users/users.component';
import {AboutComponent} from './about.component';
import {NotFoundComponent} from './not-found.component';
import {HomeComponent} from './home.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditUserComponent} from './users/edit-user.component';
import {environment} from '../environments/environment';
import {WebsocketModule} from './websocket/websocket.module';
import {MapComponent} from './map/map.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user/:id', component: EditUserComponent},
  {path: 'user', component: EditUserComponent},
  {path: 'map', component: MapComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent, UsersComponent, AboutComponent, NotFoundComponent, HomeComponent, EditUserComponent, MapComponent
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule, NoopAnimationsModule,
    BrowserModule, HttpClientModule,
    ClarityModule, ClrFormsNextModule,
    RouterModule.forRoot(appRoutes),
    WebsocketModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
