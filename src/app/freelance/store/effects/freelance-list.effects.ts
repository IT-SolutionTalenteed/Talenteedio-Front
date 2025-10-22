import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FreelanceListService } from '../../services/freelance-list.service';
import * as FreelanceListActions from '../actions/freelance-list.actions';

@Injectable()
export class FreelanceListEffects {
  loadFreelanceJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelanceListActions.loadFreelanceJobs),
      switchMap((criteria) =>
        this.freelanceListService.getFreelanceJobs(criteria).pipe(
          map((response) =>
            FreelanceListActions.loadFreelanceJobsSuccess({
              jobs: response.data,
              totalItems: response.totalItems,
            })
          ),
          catchError((error) =>
            of(FreelanceListActions.loadFreelanceJobsFailure({ error }))
          )
        )
      )
    )
  );

  loadJobTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelanceListActions.loadJobTypes),
      switchMap(() =>
        this.freelanceListService.getJobTypes().pipe(
          map((jobTypes) =>
            FreelanceListActions.loadJobTypesSuccess({ jobTypes })
          ),
          catchError((error) =>
            of(FreelanceListActions.loadJobTypesFailure({ error }))
          )
        )
      )
    )
  );

  loadJobCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelanceListActions.loadJobCategories),
      switchMap(() =>
        this.freelanceListService.getJobCategories().pipe(
          map((categories) =>
            FreelanceListActions.loadJobCategoriesSuccess({ categories })
          ),
          catchError((error) =>
            of(FreelanceListActions.loadJobCategoriesFailure({ error }))
          )
        )
      )
    )
  );

  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelanceListActions.loadCompanies),
      switchMap(() =>
        this.freelanceListService.getCompanies().pipe(
          map((companies) =>
            FreelanceListActions.loadCompaniesSuccess({ companies })
          ),
          catchError((error) =>
            of(FreelanceListActions.loadCompaniesFailure({ error }))
          )
        )
      )
    )
  );

  loadDidYouKnow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FreelanceListActions.loadDidYouKnow),
      switchMap(() =>
        this.freelanceListService.getDidYouKnow().pipe(
          map((didYouKnow) =>
            FreelanceListActions.loadDidYouKnowSuccess({ didYouKnow })
          ),
          catchError((error) =>
            of(FreelanceListActions.loadDidYouKnowFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private freelanceListService: FreelanceListService
  ) {}
}
