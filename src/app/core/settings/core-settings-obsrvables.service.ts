import {Injectable, OnDestroy} from '@angular/core';
import {OverlayContainer} from '@angular/cdk/overlay';
import {CoreSettingsService} from '@app/core/settings/core-settings.service';
import {combineLatest, interval, merge, Observable, SubscriptionLike} from 'rxjs';
import {distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ActivationEnd, Router} from '@angular/router';
import {TitleService} from '@app/core/title/title.service';
import {AnimationsService} from '../animations/animations.service';

interface Animation {
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
}

@Injectable()
export class CoreSettingsObsrvablesService implements OnDestroy {
  private languageSub: SubscriptionLike;
  private languageTitleSub: SubscriptionLike;
  private themeSub: SubscriptionLike;
  private animationSub: SubscriptionLike;

  constructor(private settingsService: CoreSettingsService,
              private router: Router,
              private titleService: TitleService,
              private overlayContainer: OverlayContainer,
              private animationsService: AnimationsService,
              private translateService: TranslateService) {

    this.languageSub = this.languageChange()
                           .subscribe(language => {
                             this.translateService.use(language);
                           });

    this.languageTitleSub = merge(
      this.languageChange(),
      this.router.events.pipe(filter(event => event instanceof ActivationEnd)))
      .subscribe(value => {
          this.titleService.setTitle(
            this.router.routerState.snapshot.root,
            this.translateService
          );
        }
      );

    this.themeSub = this.themeChange()
                        .subscribe(theme => {
                            const classList = this.overlayContainer.getContainerElement().classList;
                            const toRemove = Array.from(classList)
                                                  .filter((item: string) =>
                                                    item.includes('-theme')
                                                  );
                            if (toRemove.length) {
                              classList.remove(...toRemove);
                            }
                            classList.add(theme);
                          }
                        );

    this.animationSub = this.animationChange()
                            .subscribe(animation =>
                              this.animationsService.updateRouteAnimationType(
                                animation.pageAnimations && !animation.pageAnimationsDisabled,
                                animation.elementsAnimations
                              ));
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
    this.languageTitleSub.unsubscribe();
    this.themeSub.unsubscribe();
    this.animationSub.unsubscribe();
  }

  public themeChange(): Observable<string> {
    return combineLatest(
      this.settingsService.settings$,
      interval(60000)
        .pipe(startWith(0))
    )
      .pipe(
        map(([settings, v]) => {
          const h = new Date().getHours();
          const theme = ((settings.autoNightMode) && ((h >= 21) || (h < 7))) ? settings.nightTheme : settings.theme;
          return theme.toLocaleLowerCase();
        }),
        distinctUntilChanged()
      );
  }

  public animationChange(): Observable<Animation> {
    return this.settingsService.settings$.pipe(
      map(settings => {
        return {
          pageAnimations: settings.pageAnimations,
          pageAnimationsDisabled: settings.pageAnimationsDisabled,
          elementsAnimations: settings.elementsAnimations
        };
      }),
      distinctUntilChanged()
    );
  }

  public stickyHeaderChange(): Observable<boolean> {
    return this.settingsService.settings$.pipe(
      map(settings => settings.stickyHeader),
      distinctUntilChanged()
    );

  }

  public languageChange(): Observable<string> {
    return this.settingsService.settings$.pipe(
      map(settings => {
        return settings.language;
      }),
      distinctUntilChanged()
    );
  }
}
