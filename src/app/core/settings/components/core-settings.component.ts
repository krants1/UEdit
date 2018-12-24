import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable } from 'rxjs';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../..';

import { CoreSettingsService } from '../core-settings.service';
import { LanguageList, CoreSettings, ThemesMap } from '../core-settings.model';

@Component({
  selector: 'app-core-settings',
  templateUrl: './core-settings.component.html',
  styleUrls: ['./core-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CoreSettingsComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  settings$: Observable<CoreSettings>;
  themes = ThemesMap;
  languages = LanguageList;

  constructor(private settingsService: CoreSettingsService) {
  }

  ngOnInit() {
    this.settings$ = this.settingsService.settings$.pipe();
  }

  onLanguageSelect({ value: language }) {
    this.settingsService.save(settings => settings.language = language);
  }

  onThemeSelect({ value: theme }) {
    this.settingsService.save(settings => settings.theme = theme);
  }

  onAutoNightModeToggle({ checked: autoNightMode }) {
    this.settingsService.save(settings => settings.autoNightMode = autoNightMode);
  }

  onPageAnimationsToggle({ checked: pageAnimations }) {
    this.settingsService.save(settings => settings.pageAnimations = pageAnimations);
  }

  onElementsAnimationsToggle({ checked: elementsAnimations }) {
    this.settingsService.save(settings => settings.elementsAnimations = elementsAnimations);
  }

  onStickyHeaderToggle({ checked: stickyHeader }) {
    this.settingsService.save(settings => settings.stickyHeader = stickyHeader);
  }
}
