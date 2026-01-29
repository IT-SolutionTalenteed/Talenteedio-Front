// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mock: false,

  // dev
  // publicBaseUrl: 'https://api.rhosa.net/public',
  // apiBaseUrl: 'https://api.rhosa.net/api',
  // backOfficeBaseUrl: 'https://talenteed.rhosa.net/admin',

  // locale (Docker)
  publicBaseUrl: 'http://localhost:4200/public',
  apiBaseUrl: 'http://localhost:8080/api',
  apiUrl: 'http://localhost:8080',
  backOfficeBaseUrl: 'http://localhost:5173/admin',

  pdfBaseUrl: 'http://localhost:3010/pdf-generator',
  jwtWhitelistedDomains: ['localhost:3000'],
  blacklistedRoutes: ['http://localhost:3000/api/v1/login'],
  googleAnalytics: 'G-ME05LJVVQ2',
  siteKey: '6LeLpugnAAAAANy32tV8QyXokyO1q7HgCZUE-hLR',
  stripePublicKey: 'pk_test_51SU6lA8RbHgy6D1m3Litx37vWguQEYbYkSu5V7IAvoDHUVkslR0SwDPvx82hufR4Ol3PqFINEOh2GeQ6Ijt7jHC000Vce02392', // À remplacer par votre clé publique Stripe
  googleClientId: '694175521874-pke5utmlb5rmo9ptfqo7t35rvkto4kmk.apps.googleusercontent.com', 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
