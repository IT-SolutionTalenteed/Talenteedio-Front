# Test du Système de Disponibilité des Créneaux

## 🎯 Objectif
Vérifier que les créneaux non disponibles (déjà pris ou bloqués) sont correctement grisés et non cliquables.

## 🚀 Comment tester

### 1. Mode de données réelles (ACTIVÉ) ✅
Le système utilise maintenant les vraies données de l'API. Les dates bloquées apparaissent automatiquement grisées dans le calendrier. Pour tester :

1. Ouvrir la page de réservation : `/coaching-emploi/booking/guy/bilan`
2. Ouvrir la console du navigateur (F12)
3. Sélectionner une date dans le calendrier
4. Observer les appels API réels dans la console (📡 API Call et 📅)
5. Voir les dates bloquées automatiquement grisées dans le calendrier
6. Vérifier les créneaux gris pour les heures individuelles prises

### 2. Commandes de debug disponibles

```javascript
// Afficher l'aide
bookingDebug.help()

// Voir l'état de tous les créneaux
bookingDebug.availableSlots()

// Tester un créneau spécifique
bookingDebug.isTimeSlotAvailable('14:00')

// Inspecter un créneau en détail (DOM + logique)
bookingDebug.inspectSlot('14:00')

// Forcer un créneau comme non disponible (pour tester)
bookingDebug.forceUnavailable('14:00')

// Forcer un créneau comme disponible (pour tester)
bookingDebug.forceAvailable('14:00')

// Voir l'ID du consultant actuel
bookingDebug.consultantId()

// Recharger les créneaux de la date sélectionnée
bookingDebug.reloadCurrentDate()

// Gestion des dates bloquées
bookingDebug.blockedDates() // Voir les dates bloquées
bookingDebug.blockDate('2024-12-16') // Bloquer une date (test)
bookingDebug.unblockDate('2024-12-16') // Débloquer une date (test)
bookingDebug.reloadBlockedDates() // Recharger depuis l'API

// Activer/désactiver le mode mock
bookingDebug.setMockMode(false) // Mode API réelle (par défaut)
bookingDebug.setMockMode(true)  // Mode test (si besoin de débugger)
```

### 3. Créer des données de test réelles

Pour tester avec de vraies données, créer des réservations et blocages :

**Via l'admin (/admin/creneaux) :**
1. Se connecter en tant que consultant
2. Bloquer des dates spécifiques
3. Voir les réservations existantes

**Via la base de données :**
- Table `bookings` : réservations confirmées
- Table `blocked_dates` : dates bloquées par les consultants

**Comportement attendu :**
- **Dates bloquées** → Grisées dans le **calendrier** (🚫)
- **Créneaux pris** → Grisés dans les **heures** seulement
- **Date bloquée sélectionnée** → Tous les créneaux gris automatiquement

### 4. Comportements attendus

✅ **Créneaux disponibles :**
- Bordure bleue
- Fond blanc
- Cliquables
- Hover effect (survol)

❌ **Créneaux non disponibles :**
- Bordure grise (#bdc3c7)
- Fond gris clair (#ecf0f1)
- Texte gris (#7f8c8d)
- Curseur personnalisé 🚫 (cercle barré rouge)
- Cliquables mais sans effet (animation shake si tentative)
- Icône ✕ grise en haut à droite
- Opacity réduite (0.6)
- Au survol : fond plus foncé (#d5dbdb)
- Classes CSS: `unavailable` et `time-slot-unavailable`

⏳ **Pendant le chargement :**
- Tous les créneaux sont désactivés
- Icône de chargement ⟳

### 5. Vérifications de sécurité

Le système empêche :
- La sélection d'un créneau non disponible
- La progression vers la confirmation avec un créneau invalide
- La finalisation d'une réservation avec un créneau non disponible

### 6. Passer en mode API réelle

Quand l'API backend sera prête :

1. Dans `availability.service.ts`, changer `useMockData = false`
2. Ou utiliser `bookingDebug.setMockMode(false)` dans la console
3. L'API doit répondre sur `/api/public/availability` avec :
   ```json
   {
     "available": true/false,
     "reason": "Raison si non disponible"
   }
   ```

## 🧪 Test rapide

Pour tester immédiatement si les styles fonctionnent :

```javascript
// 1. Sélectionner une date dans le calendrier
// 2. Forcer un créneau comme non disponible
bookingDebug.forceUnavailable('14:00')

// 3. Le créneau 14:00 devrait immédiatement devenir gris avec l'icône ✕
// 4. Essayer de cliquer dessus - ça ne devrait pas fonctionner

// 5. Le remettre disponible
bookingDebug.forceAvailable('14:00')
```

## 🐛 Debugging

Si les créneaux ne se comportent pas correctement :

1. **Vérifier les appels API** - Chercher "📡 API Call" dans la console
2. **Vérifier les réponses** - Chercher "Availability for" dans la console
3. **Inspecter l'état** - `bookingDebug.availableSlots()`
4. **Vérifier l'ID consultant** - `bookingDebug.consultantId()`
5. **Tester un créneau** - `bookingDebug.inspectSlot('14:00')`
6. **Recharger** - `bookingDebug.reloadCurrentDate()`

### Erreurs courantes :
- **404 sur l'API** : Vérifier que le backend est démarré
- **Consultant ID null** : Vérifier les paramètres de route
- **Tous les créneaux gris** : Erreur API ou problème de parsing

## 📝 Notes

- Le mode mock est activé par défaut pour faciliter les tests
- Les dates sont générées dynamiquement (aujourd'hui + quelques jours)
- Le délai de simulation API est entre 100-400ms pour tester les états de chargement