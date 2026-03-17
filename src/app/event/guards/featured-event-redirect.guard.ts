import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EventService } from '../services/event.service';
import { Event } from 'src/app/shared/models/event.interface';

@Injectable({
  providedIn: 'root'
})
export class FeaturedEventRedirectGuard implements CanActivate {
  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const slug = route.params['slug'];
    
    return this.eventService.loadEvent(slug).pipe(
      map((event: Event) => {
        // Si l'événement est featured, rediriger vers /event/featured
        if (event && event.featured) {
          this.router.navigate(['/event/featured']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        // En cas d'erreur, laisser passer
        return of(true);
      })
    );
  }
}
