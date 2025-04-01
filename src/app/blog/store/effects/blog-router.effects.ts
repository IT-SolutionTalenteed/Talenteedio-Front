import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { filter, map, withLatestFrom } from 'rxjs';
import { AppRouterState } from '../../../routeur/store/reducers/router.reducers';
import {
  BLOG_DEFAULT_CRITERIA,
  BLOG_DETAIL_ROUTE_REGEX,
  BLOG_LIST_BASE_ROUTE,
} from '../../constants/blog.constant';
import { ArticleListCriteria } from '../../types/article-list-criteria.interface';
import { loadArticle, loadArticles } from '../actions/blog.actions';
import { BlogState } from '../reducers/blog.reducers';
import { getArticleListCriteria } from '../selectors/blog.selectors';

@Injectable()
export class BlogRouterEffects {
  constructor(private action$: Actions, private store: Store<BlogState>) {}

  private mapToRouterStateUrl = (action): AppRouterState =>
    action.payload.routerState;

  blogRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter(
        ({ urlWithoutQueryParams }) =>
          urlWithoutQueryParams === BLOG_LIST_BASE_ROUTE
      ),
      withLatestFrom(this.store.pipe(select(getArticleListCriteria))),
      map(([routerState, criteriaFromStore]) =>
        loadArticles(
          this.mergedCriteria(
            criteriaFromStore,
            BLOG_DEFAULT_CRITERIA,
            routerState
          )
        )
      )
    )
  );

  blogDetailRoute$ = createEffect(() =>
    this.action$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(this.mapToRouterStateUrl),
      filter((routerState) => BLOG_DETAIL_ROUTE_REGEX.test(routerState.url)),
      map((routerState) => loadArticle({ id: routerState.params['articleId'] }))
    )
  );

  private mergedCriteria(
    criteriaFromStore: ArticleListCriteria,
    defaultCriteria: ArticleListCriteria,
    routerState: AppRouterState
  ): ArticleListCriteria {
    return isEmpty(routerState.queryParams)
      ? criteriaFromStore // Use criteria from store
      : { ...defaultCriteria }; // or merge default criteria with queryParams if there is any
  }
}
