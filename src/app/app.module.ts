import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

// import {UsersComponent} from './users/users.component';
// import {EditUserComponent} from './users/edit-user.component';
import {AboutComponent} from './about.component';
import {NotFoundComponent} from './not-found.component';
import {HomeComponent} from './home.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatToolbarModule, MatSidenavModule} from '@angular/material';
import {
  MatMenuModule, MatIconModule,
  MatCardModule, MatFormFieldModule,
  MatInputModule, MatTooltipModule,
  MatListModule, MatBadgeModule,
  MatOptionModule, MatSelectModule
} from '@angular/material';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {WebsocketModule} from './websocket/websocket.module';
import {MapComponent} from './map/map.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutComponent},
 // {path: 'users', component: UsersComponent},
  // {path: 'user/:id', component: EditUserComponent},
  // {path: 'user', component: EditUserComponent},
  {path: 'map', component: MapComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    // UsersComponent, EditUserComponent,
    AboutComponent, NotFoundComponent, HomeComponent, MapComponent
  ],
  imports: [
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule, NoopAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatToolbarModule, MatSidenavModule,
    MatMenuModule, MatIconModule,
    MatCardModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule,
    MatListModule, MatBadgeModule,
    MatOptionModule, MatSelectModule,
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(appRoutes),
    WebsocketModule, FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
