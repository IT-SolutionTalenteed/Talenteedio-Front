# Module Home - Talenteed

## Structure

```
home/
├── animations/
│   └── home.animations.ts          # Animations Angular optionnelles
├── components/
│   ├── banner/                     # Hero banner (legacy)
│   ├── featured-job/               # Section des jobs en vedette
│   ├── hr-media/                   # Section médias RH
│   ├── partners/                   # Section partenaires
│   └── stats-counter/              # Nouveau: Compteur de statistiques
├── containers/
│   └── home-root/                  # Container principal de la page
├── constants/
├── services/
└── store/
```

## Composants Principaux

### HomeRootComponent
Container principal qui orchestre tous les composants de la page d'accueil.

**Sections:**
1. Hero Section - Titre principal et statistiques
2. Services Cards - 4 cartes colorées (Jobs, Missions, HR Voice, Coaching)
3. How It Works - 3 étapes explicatives
4. Featured Jobs - Jobs en vedette
5. HR Media - Articles et interviews
6. Partners - Logos des partenaires
7. CTA Section - Appel à l'action final

### StatsCounterComponent (Nouveau)
Composant réutilisable pour afficher des statistiques avec animation de compteur.

**Inputs:**
- `targetValue: number` - Valeur cible à atteindre
- `label: string` - Label de la statistique
- `suffix: string` - Suffixe (ex: '+', 'k+')
- `icon: string` - HTML de l'icône SVG

**Exemple d'utilisation:**
```html
<app-stats-counter
  [targetValue]="20000"
  [label]="'Event Planned'"
  [suffix]="'k+'"
  [icon]="starIconSvg"
></app-stats-counter>
```

## Personnalisation

### Modifier les Couleurs des Cartes
Dans `home-root.component.scss`, section `.service-card`:

```scss
&.card-jobs {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}
```

### Ajouter une Nouvelle Carte de Service
1. Ajouter le HTML dans `home-root.component.html`:
```html
<div class="service-card card-custom">
  <div class="card-icon">
    <!-- Votre icône SVG -->
  </div>
  <h3 class="card-title">Titre</h3>
  <p class="card-description">Description</p>
  <a [routerLink]="['/route']" class="card-link">Action →</a>
</div>
```

2. Ajouter les styles dans `home-root.component.scss`:
```scss
&.card-custom {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
  
  .card-icon {
    background: rgba(255, 255, 255, 0.2);
  }
}
```

### Modifier les Statistiques
Dans `home-root.component.html`, section `.hero-stats`:

```html
<div class="stat-item">
  <div class="stat-icon">
    <!-- Icône SVG -->
  </div>
  <div class="stat-content">
    <div class="stat-number">Votre nombre</div>
    <div class="stat-label">Votre label</div>
  </div>
</div>
```

## Animations (Optionnel)

Pour activer les animations, importer dans `home-root.component.ts`:

```typescript
import { homeAnimations } from '../../animations/home.animations';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss'],
  animations: [
    homeAnimations.fadeIn,
    homeAnimations.slideInLeft,
    homeAnimations.slideInRight,
    homeAnimations.staggerCards
  ]
})
```

Puis ajouter dans le template:

```html
<section class="hero-section" [@fadeIn]>
  <!-- Contenu -->
</section>

<div class="service-card" [@scaleUp]>
  <!-- Contenu -->
</div>
```

## Responsive

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 968px
- **Desktop**: > 968px

### Comportement
- **Mobile**: Colonnes uniques, tailles de police réduites
- **Tablet**: 2 colonnes pour certaines grilles
- **Desktop**: Grilles complètes, espacements maximaux

## Performance

### Optimisations Recommandées

1. **Lazy Loading des Images**
```html
<img loading="lazy" src="..." alt="...">
```

2. **Intersection Observer pour les Animations**
```typescript
// Déclencher les animations uniquement quand visible
private observeElements(): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
```

3. **Optimisation des SVG**
- Utiliser des SVG inline pour les petites icônes
- Compresser les SVG avec SVGO
- Utiliser `currentColor` pour la couleur

## Tests

### Tests Unitaires
```bash
ng test --include='**/home/**/*.spec.ts'
```

### Tests E2E
```bash
ng e2e --specs='**/home.e2e-spec.ts'
```

## Accessibilité

### Checklist
- ✅ Contraste des couleurs > 4.5:1
- ✅ Navigation au clavier
- ✅ Attributs ARIA sur les éléments interactifs
- ✅ Alt text sur les images
- ✅ Structure sémantique HTML5

### Améliorer l'Accessibilité
```html
<!-- Ajouter des labels ARIA -->
<section aria-label="Services disponibles">
  <!-- Contenu -->
</section>

<!-- Ajouter des rôles -->
<div role="button" tabindex="0">
  <!-- Contenu -->
</div>
```

## Maintenance

### Mise à Jour des Contenus
Les contenus dynamiques proviennent du store NgRx:
- `jobs$` - Jobs en vedette
- `articles$` - Articles de blog
- `partners$` - Logos partenaires
- `homeSetting$` - Paramètres de la page

### Ajouter de Nouvelles Sections
1. Créer le composant: `ng g c home/components/nouvelle-section`
2. Ajouter dans `home-root.component.html`
3. Styliser dans le composant ou dans `home-root.component.scss`
4. Connecter au store si nécessaire

## Ressources

- [Design System](../../../DESIGN_SYSTEM.md)
- [Guide de Refonte](../../../HOME_REDESIGN.md)
- [Angular Animations](https://angular.io/guide/animations)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
