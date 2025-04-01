import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/models/article.interface';
import { SubSink } from 'subsink';
import { loadArticles } from '../../store/actions/blog.actions';
import { BlogState } from '../../store/reducers/blog.reducers';
import {
  getArticleListCriteria,
  getArticleTotalItems,
  getArticles,
  getArticlesLoading,
} from '../../store/selectors/blog.selectors';
import { ArticleListCriteria } from '../../types/article-list-criteria.interface';

@Component({
  selector: 'app-blog-list-root',
  templateUrl: './blog-list-root.component.html',
  styleUrls: ['./blog-list-root.component.scss'],
})
export class BlogListRootComponent implements OnInit, OnDestroy {
  articlesLoading$: Observable<boolean>;
  articles$: Observable<Article[]>;
  articleCriteria: ArticleListCriteria;
  totalItems$: Observable<number>;

  subs = new SubSink();

  constructor(private blogStore: Store<BlogState>) {}

  ngOnInit() {
    this.articles$ = this.blogStore.pipe(select(getArticles));
    this.totalItems$ = this.blogStore.pipe(select(getArticleTotalItems));
    this.articlesLoading$ = this.blogStore.select(getArticlesLoading);
    this.subs.sink = this.blogStore
      .select(getArticleListCriteria)
      .subscribe((criteria) => (this.articleCriteria = cloneDeep(criteria)));
  }
  onSaveFilter(filter) {
    this.articleCriteria.filter = filter;
    this.blogStore.dispatch(
      loadArticles({
        ...this.articleCriteria,
        page: { ...this.articleCriteria.page, page: 1 },
      })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  onPaginate(page) {
    this.articleCriteria.page = page;
    this.blogStore.dispatch(loadArticles(this.articleCriteria));
  }
}
