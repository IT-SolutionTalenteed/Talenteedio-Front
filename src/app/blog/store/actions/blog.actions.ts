import { createAction, props } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { ArticleListCriteria } from '../../types/article-list-criteria.interface';

export const loadArticles = createAction(
  '[Blog] Load Articles',
  props<ArticleListCriteria>()
);

export const loadArticlesFail = createAction(
  '[Blog] Load Articles Fail',
  props<Error>()
);

export const loadArticlesSuccess = createAction(
  '[Blog] Load Articles Success',
  props<Paginated<Article>>()
);

export const loadArticle = createAction(
  '[Blog] Load Article',
  props<{ id: string }>()
);

export const loadArticleSuccess = createAction(
  '[Blog] Load Article Success',
  props<Article>()
);

export const loadArticleFail = createAction(
  '[Blog] Load Article Fail',
  props<Error>()
);
