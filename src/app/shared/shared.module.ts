import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatSliderModule} from '@angular/material/';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';

import {
  faBars, faUserCircle, faPowerOff, faCog, faPlayCircle, faRocket, faPlus, faEdit,
  faTrash, faTimes, faCaretUp, faCaretDown, faExclamationTriangle, faFilter, faTasks, faCheck, faSquare,
  faLanguage, faPaintBrush, faLightbulb, faWindowMaximize, faStream, faBook, faUserEdit, faUserPlus, faUserMinus,
  faThumbsDown, faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faUserCircle, faPowerOff, faCog, faRocket, faPlayCircle, faPlus, faEdit,
  faTrash, faTimes, faCaretUp, faCaretDown, faExclamationTriangle, faFilter, faTasks, faCheck, faSquare,
  faLanguage, faPaintBrush, faLightbulb, faWindowMaximize, faStream, faBook, faUserEdit, faUserPlus, faUserMinus,
  faThumbsDown, faThumbsUp
);

const MatModules = [MatButtonModule, MatToolbarModule, MatSelectModule, MatTabsModule, MatInputModule,
  MatProgressSpinnerModule, MatChipsModule, MatCardModule, MatSidenavModule, MatCheckboxModule, MatListModule,
  MatMenuModule, MatIconModule, MatTooltipModule, MatSnackBarModule, MatSlideToggleModule, MatDividerModule,
  MatBadgeModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    TranslateModule,

    ...MatModules,

    FontAwesomeModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TranslateModule,

    ...MatModules,

    FontAwesomeModule
  ]
})
export class SharedModule {
}
