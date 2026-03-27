# Pages Statiques

Ce module sert les pages HTML statiques (corporate, company, entreprise) avec leurs assets.

## Routes disponibles

- `/static/corporate` → corporate.html
- `/static/company` → company.html
- `/static/entreprise` → entreprises.html

## Structure

```
src/assets/static/
├── assets/
│   ├── css/
│   ├── images/
│   └── logo.png
├── company.html
├── corporate.html
└── entreprises.html
```

## Fonctionnement

Le composant `StaticPagesComponent` :
1. Charge le fichier HTML depuis `assets/static/`
2. Remplace automatiquement les chemins relatifs des assets
3. Injecte le HTML dans le DOM de manière sécurisée

## Ajout d'une nouvelle page

1. Ajouter le fichier `.html` dans `src/assets/static/`
2. Ajouter la route dans `static-pages.module.ts`
