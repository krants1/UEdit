export const LanguageList = ['en', 'de', 'fr', 'es'];

export enum ThemeModes {
  Default = 'DEFAULT-THEME',
  Nature = 'NATURE-THEME',
  Light = 'LIGHT-THEME',
  Night = 'BLACK-THEME'
}

export const ThemesMap = [
  { value: ThemeModes.Default, label: 'blue' },
  { value: ThemeModes.Light, label: 'light' },
  { value: ThemeModes.Nature, label: 'nature' },
  { value: ThemeModes.Night, label: 'dark' }
];

export class CoreSettings {
  testValue: boolean;
  language: string;
  theme: string;
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
}

export const DefaultCoreSettings: CoreSettings = {
  testValue: true,
  language: 'en',
  theme: 'DEFAULT-THEME',
  autoNightMode: false,
  nightTheme: ThemeModes.Night,
  stickyHeader: true,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true
};
