# Design System - Talenteed

## Palette de Couleurs

### Couleurs Principales
```scss
$primary: #1967d2;        // Bleu principal
$secondary: #eb5432;      // Orange/Rouge accent
$background: #f5f7fc;     // Fond clair
$black: #202124;          // Texte principal
$text-color: #696969;     // Texte secondaire
```

### Dégradés pour les Cartes
```scss
// Jobs - Rouge-Orange
background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);

// Missions - Turquoise-Vert
background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);

// HR Voice - Jaune-Orange
background: linear-gradient(135deg, #F7B731 0%, #F79F1F 100%);

// Coaching - Vert clair
background: linear-gradient(135deg, #A8E6CF 0%, #7FB069 100%);

// CTA Section - Violet
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Typographie

### Hiérarchie des Titres
```scss
// Hero Title
font-size: 56px;
font-weight: 700;
line-height: 1.2;

// Section Title
font-size: 48px;
font-weight: 700;

// Card Title
font-size: 24px;
font-weight: 700;

// Body Text
font-size: 15-16px;
line-height: 1.6;
```

### Responsive
```scss
@media screen and (max-width: 768px) {
  // Hero Title
  font-size: 40px;
  
  // Section Title
  font-size: 36px;
}
```

## Espacements

### Sections
```scss
padding: 60px 20px;  // Sections standard
padding: 80px 20px;  // Sections importantes (Hero, How it works)
padding: 100px 20px; // CTA Section
```

### Gaps
```scss
gap: 24px;  // Grilles de cartes
gap: 40px;  // Grilles d'étapes
gap: 60px;  // Hero content
```

### Marges
```scss
margin-bottom: 12px;  // Entre titre et sous-titre
margin-bottom: 16px;  // Entre éléments proches
margin-bottom: 32px;  // Entre sections de contenu
margin-bottom: 48px;  // Avant contenu principal
```

## Composants

### Cartes de Service
```html
<div class="service-card card-[type]">
  <div class="card-icon">
    <!-- SVG Icon -->
  </div>
  <h3 class="card-title">Titre</h3>
  <p class="card-description">Description</p>
  <a class="card-link">Action →</a>
</div>
```

**Propriétés:**
- `padding: 32px`
- `border-radius: 16px`
- Hover: `transform: translateY(-8px)`
- Transition: `0.3s ease`

### Icônes
```html
<div class="icon-container">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="..." fill="currentColor"/>
  </svg>
</div>
```

**Tailles:**
- Petite: 24x24px
- Moyenne: 32x32px
- Grande: 48x48px
- Extra-large: 56x56px (cartes)
- XXL: 80x80px (étapes)

### Boutons

#### Bouton Principal
```scss
.primary-button {
  background: $secondary;
  color: white;
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: $secondary-hover;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(235, 84, 50, 0.4);
  }
}
```

#### Lien de Carte
```scss
.card-link {
  color: white;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: gap 0.3s ease;
  
  &:hover {
    gap: 8px;
  }
}
```

## Grilles

### Grid Responsive Standard
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

### Grid 2 Colonnes (Hero)
```scss
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media screen and (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}
```

## Animations

### Hover Effects
```scss
// Card Lift
&:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

// Button Lift
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(235, 84, 50, 0.4);
}

// Link Spacing
&:hover {
  gap: 8px;
}
```

### Transitions
```scss
transition: all 0.3s ease;           // Standard
transition: transform 0.3s ease;     // Transform only
transition: gap 0.3s ease;           // Gap animation
```

## Breakpoints

```scss
// Mobile
@media screen and (max-width: 768px) { }

// Tablet
@media screen and (max-width: 968px) { }

// Desktop
@media screen and (min-width: 1200px) { }
```

## Conteneurs

### Max Width Standard
```scss
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}
```

### Conteneur de Contenu
```scss
.content-container {
  max-width: 800px;
  margin: 0 auto;
}
```

## Ombres

```scss
// Légère
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

// Moyenne
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

// Forte (hover)
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

// Bouton (hover)
box-shadow: 0 8px 24px rgba(235, 84, 50, 0.4);
```

## Border Radius

```scss
border-radius: 8px;   // Petit
border-radius: 12px;  // Moyen (standard)
border-radius: 16px;  // Grand (cartes)
border-radius: 20px;  // Extra-grand (icônes)
```

## Bonnes Pratiques

1. **Cohérence**: Utiliser les variables SCSS pour les couleurs
2. **Responsive**: Mobile-first approach
3. **Performance**: Utiliser transform pour les animations
4. **Accessibilité**: Contraste minimum 4.5:1
5. **Maintenance**: Commenter les sections complexes
6. **Réutilisabilité**: Créer des composants pour les patterns répétés
