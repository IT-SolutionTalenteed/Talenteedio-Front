import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Article } from 'src/app/shared/models/article.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { BlogState } from '../reducers/blog.reducers';

export const getBlogState = createFeatureSelector<BlogState>('blog');

export const getPaginatedArticles = createSelector(
  getBlogState,
  (state: BlogState) => state.articles
);

export const getArticles = createSelector(
  getBlogState,
  (state: BlogState) => state.articles.items
);

export const getArticleListCriteria = createSelector(
  getBlogState,
  (state: BlogState) => state.articleListCriteria
);

export const getArticlesLoading = createSelector(
  getBlogState,
  (state: BlogState) => state.articlesLoading
);

export const getArticle = createSelector(
  getBlogState,
  (state: BlogState) => state.article
);

export const getArticleLoaded = createSelector(
  getBlogState,
  (state: BlogState) => state.articleLoaded
);

export const getArticleLoading = createSelector(
  getBlogState,
  (state: BlogState) => state.articleLoading
);

export const getArticleTotalItems = createSelector(
  getPaginatedArticles,
  (paginatedArticles: Paginated<Article>) => paginatedArticles.totalItems
);
