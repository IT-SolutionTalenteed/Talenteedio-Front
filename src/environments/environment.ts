// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mock: false,

  // dev
  publicBaseUrl: 'https://api.rhosa.net/public',
  apiBaseUrl: 'https://api.rhosa.net/api',
  backOfficeBaseUrl: 'https://talenteed.rhosa.net/admin',

  // locale
  // publicBaseUrl: 'http://localhost:8080/public',
  // apiBaseUrl: 'http://localhost:8080/api',
  // backOfficeBaseUrl: 'http://localhost:5173/admin',

  pdfBaseUrl: 'http://localhost:3010/pdf-generator',
  jwtWhitelistedDomains: ['localhost:3000'],
  blacklistedRoutes: ['http://localhost:3000/api/v1/login'],
  googleAnalytics: 'G-ME05LJVVQ2',
  siteKey: '6LeLpugnAAAAANy32tV8QyXokyO1q7HgCZUE-hLR',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
