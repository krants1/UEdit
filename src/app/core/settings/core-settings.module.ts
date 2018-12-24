import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { CoreSettingsComponent } from './components/core-settings.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [CoreSettingsComponent]
})
export class CoreSettingsModule {
}
