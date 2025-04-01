import { ActivatedRouteSnapshot } from '@angular/router';

export const getResolvedUrl = (route: ActivatedRouteSnapshot): string =>
  route.pathFromRoot
    .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    .join('/');
