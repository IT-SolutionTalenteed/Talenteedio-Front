import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigationAction } from '@ngrx/router-store';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import {
  back,
  forward,
  go,
  navigationLaunched,
  scroll,
  showSuccess,
} from '../actions/router.actions';

@Injectable()
export class RouterEffects {
  private tosterOption: Partial<IndividualConfig<unknown>> = {
    progressBar: true,
    closeButton: true,
    progressAnimation: 'increasing',
  };

  constructor(
    private action$: Actions,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) {}

  go$ = createEffect(() =>
    this.action$.pipe(
      ofType(go),
      tap(({ path, query: queryParams, extras }) =>
        this.router.navigate(path, { queryParams, ...extras })
      ),
      map(() => navigationLaunched())
    )
  );

  back$ = createEffect(() =>
    this.action$.pipe(
      ofType(back),
      tap(() => this.location.back()),
      map(() => navigationLaunched())
    )
  );

  forward$ = createEffect(() =>
    this.action$.pipe(
      ofType(forward),
      tap(() => this.location.forward()),
      map(() => navigationLaunched())
    )
  );

  scroll$ = createEffect(() =>
    this.action$.pipe(
      ofType(scroll),
      tap(({ id }) =>
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      ),
      map(() => navigationLaunched())
    )
  );
  showSuccess$ = createEffect(() =>
    this.action$.pipe(
      ofType(showSuccess),
      tap(({ message }) =>
        this.toastr.success(message || '', 'Success', this.tosterOption)
      ),
      map(() => navigationLaunched())
    )
  );
  scrollToTopOnNavigation$ = createEffect(() =>
    this.action$.pipe(
      ofType<RouterNavigationAction>(ROUTER_NAVIGATED),
      tap(() => {
        if (typeof window !== 'undefined') {
          document?.querySelector('main')?.scrollTo(0, 0);
        }
      }),
      map(() => navigationLaunched())
    )
  );
}
