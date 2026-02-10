import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('fr');
  private translations: any = {};
  private translationsLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Charger la langue depuis le localStorage ou utiliser 'fr' par défaut
    const savedLang = this.getSavedLanguage();
    this.loadTranslations(savedLang);
  }

  private getSavedLanguage(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('language') as Language;
      return saved || 'fr';
    }
    return 'fr';
  }

  private saveLanguage(lang: Language): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', lang);
    }
  }

  loadTranslations(lang: Language): void {
    this.translationsLoaded$.next(false);
    this.http.get(`/assets/i18n/${lang}.json`).subscribe({
      next: (translations) => {
        this.translations = translations;
        this.currentLanguage$.next(lang);
        this.saveLanguage(lang);
        this.translationsLoaded$.next(true);
        console.log(`Translations loaded for ${lang}:`, translations);
      },
      error: (error) => {
        console.error('Error loading translations:', error);
        this.translationsLoaded$.next(true);
      }
    });
  }

  setLanguage(lang: Language): void {
    if (lang !== this.currentLanguage$.value) {
      console.log(`Changing language to: ${lang}`);
      this.loadTranslations(lang);
    }
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  getCurrentLanguageValue(): Language {
    return this.currentLanguage$.value;
  }

  getTranslationsLoaded(): Observable<boolean> {
    return this.translationsLoaded$.asObservable();
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Retourner la clé si la traduction n'existe pas
      }
    }

    return value;
  }

  instant(key: string): string {
    return this.translate(key);
  }
}
