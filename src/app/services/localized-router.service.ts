import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TranslationService, Language } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizedRouterService {
  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {}

  /**
   * Navigate to a route with language prefix
   */
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    const lang = this.translationService.getCurrentLanguageValue();
    const localizedCommands = this.localizeRoute(commands, lang);
    return this.router.navigate(localizedCommands, extras);
  }

  /**
   * Get localized route path
   */
  getLocalizedPath(path: string, lang?: Language): string {
    const currentLang = lang || this.translationService.getCurrentLanguageValue();
    
    // Si la langue est le français (langue par défaut), pas de préfixe
    if (currentLang === 'fr') {
      return path;
    }
    
    // Pour l'anglais, ajouter le préfixe /en
    return `/en${path.startsWith('/') ? path : '/' + path}`;
  }

  /**
   * Localize route commands array
   */
  private localizeRoute(commands: any[], lang: Language): any[] {
    if (!commands || commands.length === 0) {
      return commands;
    }

    // Si la langue est le français, retourner les commandes telles quelles
    if (lang === 'fr') {
      return commands;
    }

    // Pour l'anglais, ajouter le préfixe /en
    const firstCommand = commands[0];
    if (typeof firstCommand === 'string' && firstCommand.startsWith('/')) {
      return ['/en' + firstCommand, ...commands.slice(1)];
    }

    return ['/en', ...commands];
  }
}
