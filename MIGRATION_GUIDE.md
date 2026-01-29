# Guide de Migration - Nouvelle Page d'Accueil

## Vue d'ensemble

Ce guide vous aide à migrer de l'ancienne page d'accueil vers la nouvelle version redesignée.

## Changements Majeurs

### 1. Structure HTML
- ✅ Suppression du composant `<app-banner>`
- ✅ Ajout de sections modernes (Hero, Services Cards, How It Works, CTA)
- ✅ Réorganisation du contenu en sections sémantiques
- ✅ Conservation des composants existants (featured-job, hr-media, partners)

### 2. Styles
- ✅ Nouveau système de grilles CSS Grid
- ✅ Dégradés colorés pour les cartes de services
- ✅ Animations et transitions améliorées
- ✅ Design responsive optimisé

### 3. Composants
- ✅ Nouveau composant `StatsCounterComponent` (optionnel)
- ✅ Nouveau fichier d'animations `home.animations.ts` (optionnel)
- ✅ Bibliothèque d'icônes centralisée

## Étapes de Migration

### Étape 1: Backup
```bash
# Créer une branche de backup
git checkout -b backup/old-home-design
git add .
git commit -m "Backup: Old home design before migration"

# Retourner sur la branche principale
git checkout main
```

### Étape 2: Vérifier les Dépendances
```bash
# Vérifier que Angular est à jour
ng version

# Installer les dépendances si nécessaire
npm install
```

### Étape 3: Tester l'Ancien Design
```bash
# Lancer l'application
ng serve

# Ouvrir http://localhost:4200
# Prendre des screenshots pour comparaison
```

### Étape 4: Appliquer les Changements

Les fichiers suivants ont été modifiés :
- ✅ `home-root.component.html` - Nouvelle structure
- ✅ `home-root.component.scss` - Nouveaux styles
- ⚠️ `home-root.component.ts` - Aucune modification (logique préservée)

### Étape 5: Ajouter les Assets (Optionnel)

Si vous souhaitez utiliser des images dans la hero section :

```bash
# Créer le dossier si nécessaire
mkdir -p src/assets/img

# Ajouter vos images
# - card-preview.png (pour la hero section)
# - Autres images selon vos besoins
```

### Étape 6: Tester le Nouveau Design
```bash
# Relancer l'application
ng serve

# Vérifier sur différents appareils
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x667)
```

### Étape 7: Ajustements Personnalisés

#### Modifier les Couleurs
Dans `home-root.component.scss`:

```scss
// Exemple: Changer la couleur de la carte Jobs
&.card-jobs {
  background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}
```

#### Modifier les Textes
Dans `home-root.component.html`:

```html
<!-- Exemple: Changer le titre hero -->
<h1 class="hero-title">
  Votre Nouveau Titre <span class="accent">Accentué</span>
</h1>
```

#### Modifier les Statistiques
Dans `home-root.component.html`:

```html
<!-- Exemple: Changer les chiffres -->
<div class="stat-number">VOS_STATS</div>
<div class="stat-label">Votre Label</div>
```

## Rollback (Si Nécessaire)

Si vous devez revenir à l'ancien design :

```bash
# Option 1: Utiliser Git
git checkout backup/old-home-design -- src/app/home/containers/home-root/

# Option 2: Restaurer depuis un commit
git log --oneline  # Trouver le commit avant migration
git checkout <commit-hash> -- src/app/home/containers/home-root/

# Recompiler
ng serve
```

## Checklist de Migration

### Avant le Déploiement
- [ ] Tests sur Chrome, Firefox, Safari, Edge
- [ ] Tests responsive (mobile, tablet, desktop)
- [ ] Vérification des liens (routerLink)
- [ ] Vérification des images (chemins corrects)
- [ ] Tests de performance (Lighthouse)
- [ ] Validation HTML (W3C Validator)
- [ ] Tests d'accessibilité (WAVE, axe)

### Après le Déploiement
- [ ] Monitoring des erreurs (Sentry, etc.)
- [ ] Analytics (Google Analytics, etc.)
- [ ] Feedback utilisateurs
- [ ] A/B testing (optionnel)

## Problèmes Courants

### 1. Images ne s'affichent pas
**Solution:**
```html
<!-- Vérifier le chemin -->
<img src="assets/img/votre-image.png" alt="Description">

<!-- Ou utiliser un placeholder temporaire -->
<img src="https://via.placeholder.com/600x400" alt="Placeholder">
```

### 2. Styles ne s'appliquent pas
**Solution:**
```bash
# Nettoyer le cache
rm -rf .angular/cache
ng serve --poll=2000
```

### 3. Animations saccadées
**Solution:**
```scss
// Utiliser transform au lieu de margin/padding
// Mauvais
&:hover {
  margin-top: -8px;
}

// Bon
&:hover {
  transform: translateY(-8px);
}
```

### 4. Grid ne fonctionne pas sur IE11
**Solution:**
```scss
// Ajouter un fallback flexbox
.services-grid {
  display: flex;
  flex-wrap: wrap;
  
  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}
```

## Optimisations Post-Migration

### 1. Lazy Loading des Images
```html
<img loading="lazy" src="..." alt="...">
```

### 2. Optimisation des SVG
```bash
# Installer SVGO
npm install -g svgo

# Optimiser les SVG
svgo -f src/assets/icons
```

### 3. Compression des Images
```bash
# Utiliser imagemin ou un service en ligne
# - TinyPNG
# - Squoosh
# - ImageOptim
```

### 4. Critical CSS
```bash
# Extraire le CSS critique
npm install -g critical

critical src/index.html --base src --inline > src/index-critical.html
```

## Support

### Documentation
- [Design System](./DESIGN_SYSTEM.md)
- [Guide de Refonte](./HOME_REDESIGN.md)
- [README du Module Home](./src/app/home/README.md)

### Ressources Externes
- [Angular Documentation](https://angular.io/docs)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web.dev Performance](https://web.dev/performance/)

### Contact
Pour toute question ou problème, contactez l'équipe de développement.

## Changelog

### Version 2.0.0 (2026-01-29)
- ✨ Nouveau design moderne inspiré des tendances 2026
- ✨ Hero section avec statistiques
- ✨ Cartes de services colorées avec dégradés
- ✨ Section "How it works" en 3 étapes
- ✨ CTA section finale
- 🎨 Amélioration du responsive design
- 🎨 Animations et transitions fluides
- ♿ Amélioration de l'accessibilité
- 📱 Optimisation mobile-first
- 🚀 Meilleures performances

### Version 1.0.0 (Précédent)
- Design initial avec banner
- Sections basiques
- Responsive simple
