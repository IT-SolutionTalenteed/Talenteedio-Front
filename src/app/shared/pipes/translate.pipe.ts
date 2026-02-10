import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private languageSubscription: Subscription;
  private loadedSubscription: Subscription;
  private lastKey: string;
  private lastValue: string;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    // S'abonner aux changements de langue
    this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(() => {
      this.lastValue = null;
      this.cdr.markForCheck();
    });

    // S'abonner au chargement des traductions
    this.loadedSubscription = this.translationService.getTranslationsLoaded().subscribe((loaded) => {
      if (loaded) {
        this.lastValue = null;
        this.cdr.markForCheck();
      }
    });
  }

  transform(key: string): string {
    if (!key) {
      return '';
    }

    // Si la clé a changé ou si on n'a pas encore de valeur, récupérer la traduction
    if (key !== this.lastKey || !this.lastValue) {
      this.lastKey = key;
      this.lastValue = this.translationService.translate(key);
    }

    return this.lastValue || key;
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.loadedSubscription) {
      this.loadedSubscription.unsubscribe();
    }
  }
}
