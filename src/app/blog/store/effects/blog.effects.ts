import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { Article } from 'src/app/shared/models/article.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { BlogService } from '../../services/blog.service';
import { ArticleListCriteria } from '../../types/article-list-criteria.interface';
import {
  loadArticle,
  loadArticleFail,
  loadArticleSuccess,
  loadArticles,
  loadArticlesFail,
  loadArticlesSuccess,
} from '../actions/blog.actions';
import { BlogState } from '../reducers/blog.reducers';

@Injectable()
export class BlogEffects {
  constructor(
    private action$: Actions,
    private blogService: BlogService,
    private store: Store<BlogState>
  ) {}

  loadArticles$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadArticles),
      switchMap((props: ArticleListCriteria) =>
        this.blogService.loadArticles(props).pipe(
          map((response: Paginated<Article>) => loadArticlesSuccess(response)),
          catchError((error) => of(loadArticlesFail(error)))
        )
      )
    )
  );
  loadArticle$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadArticle),
      switchMap((props: { id: string }) =>
        this.blogService.loadArticle(props.id).pipe(
          map((response: Article) => loadArticleSuccess(response)),
          catchError((error) => of(loadArticleFail(error)))
        )
      )
    )
  );
}
