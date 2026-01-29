# Guide de Personnalisation Avancée

## Table des Matières
1. [Configuration Dynamique](#configuration-dynamique)
2. [Animations Personnalisées](#animations-personnalisées)
3. [Thèmes Multiples](#thèmes-multiples)
4. [Statistiques en Temps Réel](#statistiques-en-temps-réel)
5. [A/B Testing](#ab-testing)
6. [Internationalisation](#internationalisation)

## Configuration Dynamique

### Utiliser les Constantes de Configuration

Au lieu de modifier directement le HTML, utilisez les constantes :

```typescript
// home-root.component.ts
import { SERVICE_CARDS, HOW_IT_WORKS_STEPS, HERO_STATS } from '../../constants/home-config.constants';

export class HomeRootComponent implements OnInit {
  serviceCards = SERVICE_CARDS;
  howItWorksSteps = HOW_IT_WORKS_STEPS;
  heroStats = HERO_STATS;
  
  // ...
}
```

```html
<!-- home-root.component.html -->
<div class="services-grid">
  <div *ngFor="let card of serviceCards" 
       class="service-card"
       [ngClass]="'card-' + card.id"
       [ngStyle]="{'background': card.gradient}">
    <div class="card-icon" [innerHTML]="getIcon(card.icon)"></div>
    <h3 class="card-title">{{ card.title }}</h3>
    <p class="card-description">{{ card.description }}</p>
    <a [routerLink]="[card.route]" class="card-link">
      {{ card.linkText }} →
    </a>
  </div>
</div>
```

### Configuration depuis l'API

```typescript
// home-root.component.ts
export class HomeRootComponent implements OnInit {
  serviceCards: ServiceCard[] = [];
  
  ngOnInit(): void {
    // Charger depuis l'API
    this.homeService.getServiceCards().subscribe(cards => {
      this.serviceCards = cards;
    });
    
    // Ou utiliser les valeurs par défaut
    this.serviceCards = SERVICE_CARDS;
  }
}
```

## Animations Personnalisées

### Animations au Scroll

```typescript
// home-root.component.ts
import { ViewChild, ElementRef } from '@angular/core';

export class HomeRootComponent implements OnInit, AfterViewInit {
  @ViewChild('servicesSection') servicesSection: ElementRef;
  
  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }
  
  private setupScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observer les sections
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}
```

```scss
// home-root.component.scss
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
  
  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Animations de Compteur Avancées

```typescript
// stats-counter.component.ts
export class StatsCounterComponent implements OnInit {
  private animateCounter(): void {
    const duration = 2000;
    const steps = 60;
    const easeOutQuad = (t: number) => t * (2 - t); // Easing function
    
    let currentStep = 0;
    const stepDuration = duration / steps;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = easeOutQuad(progress);
      
      this.currentValue = Math.floor(this.targetValue * easedProgress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        this.currentValue = this.targetValue;
      }
    }, stepDuration);
  }
}
```

## Thèmes Multiples

### Système de Thèmes

```typescript
// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  gradients: {
    jobs: string;
    missions: string;
    voice: string;
    coaching: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>(this.defaultTheme);
  currentTheme$ = this.currentTheme.asObservable();
  
  private defaultTheme: Theme = {
    name: 'default',
    colors: {
      primary: '#1967d2',
      secondary: '#eb5432',
      background: '#f5f7fc'
    },
    gradients: {
      jobs: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      missions: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      voice: 'linear-gradient(135deg, #F7B731 0%, #F79F1F 100%)',
      coaching: 'linear-gradient(135deg, #A8E6CF 0%, #7FB069 100%)'
    }
  };
  
  private darkTheme: Theme = {
    name: 'dark',
    colors: {
      primary: '#4a9eff',
      secondary: '#ff6b6b',
      background: '#1a1a1a'
    },
    gradients: {
      jobs: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      missions: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      voice: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      coaching: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  };
  
  setTheme(themeName: 'default' | 'dark'): void {
    const theme = themeName === 'dark' ? this.darkTheme : this.defaultTheme;
    this.currentTheme.next(theme);
    this.applyTheme(theme);
  }
  
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--secondary-color', theme.colors.secondary);
    root.style.setProperty('--background-color', theme.colors.background);
  }
}
```

```typescript
// home-root.component.ts
export class HomeRootComponent implements OnInit {
  currentTheme: Theme;
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }
  
  getCardGradient(cardId: string): string {
    return this.currentTheme.gradients[cardId] || '';
  }
}
```

## Statistiques en Temps Réel

### WebSocket pour Stats Dynamiques

```typescript
// stats.service.ts
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StatsService {
  // Simuler des stats en temps réel
  getLiveStats(): Observable<{ jobs: number; users: number }> {
    return interval(5000).pipe(
      startWith(0),
      map(() => ({
        jobs: Math.floor(Math.random() * 100) + 20000,
        users: Math.floor(Math.random() * 50) + 260
      }))
    );
  }
  
  // Ou utiliser un vrai WebSocket
  connectToStatsWebSocket(): Observable<any> {
    return new Observable(observer => {
      const ws = new WebSocket('wss://api.talenteed.io/stats');
      
      ws.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };
      
      ws.onerror = (error) => {
        observer.error(error);
      };
      
      ws.onclose = () => {
        observer.complete();
      };
      
      return () => ws.close();
    });
  }
}
```

```typescript
// home-root.component.ts
export class HomeRootComponent implements OnInit, OnDestroy {
  liveStats$: Observable<any>;
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.liveStats$ = this.statsService.getLiveStats().pipe(
      takeUntil(this.destroy$)
    );
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```html
<!-- home-root.component.html -->
<div class="hero-stats" *ngIf="liveStats$ | async as stats">
  <app-stats-counter
    [targetValue]="stats.jobs"
    [label]="'Jobs Posted'"
    [suffix]="'k+'"
  ></app-stats-counter>
</div>
```

## A/B Testing

### Service d'A/B Testing

```typescript
// ab-test.service.ts
import { Injectable } from '@angular/core';

export type Variant = 'A' | 'B';

@Injectable({ providedIn: 'root' })
export class ABTestService {
  private readonly STORAGE_KEY = 'ab_test_variant';
  
  getVariant(testName: string): Variant {
    // Vérifier si l'utilisateur a déjà une variante assignée
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${testName}`);
    if (stored === 'A' || stored === 'B') {
      return stored;
    }
    
    // Assigner aléatoirement
    const variant: Variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(`${this.STORAGE_KEY}_${testName}`, variant);
    
    // Logger pour analytics
    this.trackVariant(testName, variant);
    
    return variant;
  }
  
  private trackVariant(testName: string, variant: Variant): void {
    // Envoyer à Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_assigned', {
        test_name: testName,
        variant: variant
      });
    }
  }
  
  trackConversion(testName: string, conversionType: string): void {
    const variant = this.getVariant(testName);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_conversion', {
        test_name: testName,
        variant: variant,
        conversion_type: conversionType
      });
    }
  }
}
```

```typescript
// home-root.component.ts
export class HomeRootComponent implements OnInit {
  heroVariant: Variant;
  
  constructor(private abTestService: ABTestService) {}
  
  ngOnInit(): void {
    this.heroVariant = this.abTestService.getVariant('hero_design');
  }
  
  onCTAClick(): void {
    this.abTestService.trackConversion('hero_design', 'cta_click');
  }
}
```

```html
<!-- home-root.component.html -->
<section class="hero-section" [ngClass]="'variant-' + heroVariant">
  <div *ngIf="heroVariant === 'A'">
    <!-- Version A -->
  </div>
  <div *ngIf="heroVariant === 'B'">
    <!-- Version B -->
  </div>
</section>
```

## Internationalisation

### Configuration i18n

```typescript
// home.i18n.ts
export const HOME_TRANSLATIONS = {
  en: {
    hero: {
      subtitle: 'Exceeding Career Expectations',
      title: 'Creating the Best. Day.',
      titleAccent: 'Ever.'
    },
    services: {
      jobs: {
        title: 'Find Jobs',
        description: 'Your gateway to endless possibilities and exciting career opportunities',
        action: 'Browse jobs'
      },
      missions: {
        title: 'Find Missions',
        description: 'Discover freelance opportunities and connect with exciting projects',
        action: 'Browse missions'
      }
    },
    howItWorks: {
      title: 'How it works',
      subtitle: 'A few steps to get started in 3 steps'
    }
  },
  fr: {
    hero: {
      subtitle: 'Dépassez vos attentes professionnelles',
      title: 'Créer la meilleure. Journée.',
      titleAccent: 'Jamais.'
    },
    services: {
      jobs: {
        title: 'Trouver un Emploi',
        description: 'Votre porte d\'entrée vers des possibilités infinies et des opportunités de carrière passionnantes',
        action: 'Parcourir les emplois'
      },
      missions: {
        title: 'Trouver des Missions',
        description: 'Découvrez des opportunités freelance et connectez-vous avec des projets passionnants',
        action: 'Parcourir les missions'
      }
    },
    howItWorks: {
      title: 'Comment ça marche',
      subtitle: 'Quelques étapes pour commencer en 3 étapes'
    }
  }
};
```

```typescript
// home-root.component.ts
import { TranslateService } from '@ngx-translate/core';

export class HomeRootComponent implements OnInit {
  constructor(private translate: TranslateService) {}
  
  ngOnInit(): void {
    // Utiliser les traductions
    this.translate.use('fr'); // ou 'en'
  }
}
```

```html
<!-- home-root.component.html -->
<h1 class="hero-title">
  {{ 'home.hero.title' | translate }}
  <span class="accent">{{ 'home.hero.titleAccent' | translate }}</span>
</h1>
```

## Performance Avancée

### Virtual Scrolling pour Grandes Listes

```typescript
// Si vous avez beaucoup de jobs à afficher
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="200" class="jobs-viewport">
      <div *cdkVirtualFor="let job of jobs$ | async" class="job-card">
        <!-- Job content -->
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
```

### Lazy Loading des Composants

```typescript
// home-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: HomeRootComponent,
    children: [
      {
        path: 'details',
        loadChildren: () => import('./details/details.module').then(m => m.DetailsModule)
      }
    ]
  }
];
```

## Conclusion

Ces techniques avancées vous permettent de :
- ✅ Personnaliser facilement le contenu
- ✅ Implémenter des animations sophistiquées
- ✅ Supporter plusieurs thèmes
- ✅ Afficher des données en temps réel
- ✅ Effectuer des tests A/B
- ✅ Supporter plusieurs langues
- ✅ Optimiser les performances

Pour plus d'informations, consultez la documentation Angular officielle.
