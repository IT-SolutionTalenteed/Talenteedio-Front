import { Action, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Article } from 'src/app/shared/models/article.interface';
import { Paginated } from 'src/app/shared/types/paginated.interface';
import { BLOG_DEFAULT_CRITERIA } from '../../constants/blog.constant';
import { ArticleListCriteria } from '../../types/article-list-criteria.interface';
import {
  loadArticle,
  loadArticleFail,
  loadArticleSuccess,
  loadArticles,
  loadArticlesFail,
  loadArticlesSuccess,
} from '../actions/blog.actions';

export interface BlogState {
  articles: Paginated<Article>;
  articlesLoading: boolean;
  articlesLoaded: boolean;
  articleListCriteria: ArticleListCriteria;
  article: Article;
  articleLoading: boolean;
  articleLoaded: boolean;
}

const initialState: BlogState = {
  articles: { items: [], totalItems: 0 },
  articlesLoading: false,
  articlesLoaded: false,
  articleListCriteria: cloneDeep(BLOG_DEFAULT_CRITERIA),
  article: undefined,
  articleLoading: false,
  articleLoaded: false,
};

const loadArticlesReducer = (
  state: BlogState,
  props: ArticleListCriteria
): BlogState => ({
  ...state,
  articlesLoading: true,
  articlesLoaded: false,
  articleListCriteria: props,
});

const loadArticlesFailReducer = (state: BlogState): BlogState => ({
  ...state,
  articlesLoading: false,
  articlesLoaded: false,
});

const loadArticlesSuccessReducer = (
  state: BlogState,
  props: Paginated<Article>
): BlogState => ({
  ...state,
  articlesLoading: false,
  articlesLoaded: true,
  articles: props,
});

const loadArticleReducer = (state: BlogState): BlogState => ({
  ...state,
  articleLoading: true,
  articleLoaded: false,
});

const loadArticleFailReducer = (state: BlogState): BlogState => ({
  ...state,
  articleLoading: false,
  articleLoaded: false,
  article: undefined,
});

const loadArticleSuccessReducer = (
  state: BlogState,
  props: Article
): BlogState => ({
  ...state,
  articleLoading: false,
  articleLoaded: true,
  article: props,
});

const reducer = createReducer(
  initialState,
  on(loadArticles, loadArticlesReducer),
  on(loadArticlesFail, loadArticlesFailReducer),
  on(loadArticlesSuccess, loadArticlesSuccessReducer),
  on(loadArticle, loadArticleReducer),
  on(loadArticleFail, loadArticleFailReducer),
  on(loadArticleSuccess, loadArticleSuccessReducer)
);

export function blogReducer(state: BlogState | undefined, action: Action) {
  return reducer(state, action);
}
