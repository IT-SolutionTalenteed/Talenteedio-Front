import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/models/article.interface';
import { SubSink } from 'subsink';
import { BlogState } from '../../store/reducers/blog.reducers';
import {
  getArticle,
  getArticleLoading,
} from '../../store/selectors/blog.selectors';

@Component({
  selector: 'app-blog-detail-root',
  templateUrl: './blog-detail-root.component.html',
  styleUrls: ['./blog-detail-root.component.scss'],
})
export class BlogDetailRootComponent implements OnInit, OnDestroy {
  articleLoading$: Observable<boolean>;
  article$: Observable<Article>;
  article: Article;

  sub = new SubSink();
  constructor(
    private blogStore: Store<BlogState>,
    private meta: Meta,
    private location: Location,
    private titleService: Title
  ) {
    this.meta.addTag({ property: 'og:test', content: 'test' });
  }
  ngOnInit(): void {
    this.articleLoading$ = this.blogStore.pipe(select(getArticleLoading));
    this.article$ = this.blogStore.pipe(select(getArticle));
    this.sub.sink = this.article$.subscribe((article) => {
      this.article = article;
      if (article) {
        this.titleService.setTitle(`${article.title} | Talenteed`);
        this.initMeta();
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  initMeta() {
    this.initFacebookMeta();
    this.initTwitterMeta();
    this.initPinterestMeta();
    this.initLinkedInMeta();
  }
  initFacebookMeta() {
    // facebook
    this.meta.addTag({ property: 'og:title', content: this.article.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.article.metaDescription,
    });
    this.meta.addTag({
      property: 'og:image',
      content: this.article?.image?.fileUrl ?? '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
  }
  initLinkedInMeta() {
    // LinkedIn
    this.meta.addTag({ property: 'og:title', content: this.article.title });
    this.meta.addTag({
      property: 'og:description',
      content: this.article.metaDescription ?? '',
    });
    this.meta.addTag({
      property: 'og:image',
      content: this.article?.image?.fileUrl ?? '/assets/img/thumb.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: this.location.prepareExternalUrl(this.location.path()),
    });
    this.meta.addTag({
      property: 'og:type',
      content: 'website',
    });
    this.meta.addTag({
      property: 'og:site_name',
      content: 'Talenteed.io',
    });
  }
  initTwitterMeta() {
    this.meta.addTag({
      property: 'twitter:title',
      content: this.article.title,
    });
    this.meta.addTag({
      property: 'twitter:description',
      content: this.article.metaDescription,
    });
    this.meta.addTag({
      property: 'twitter:image',
      content: this.article?.image?.fileUrl ?? '/assets/img/thumb.jpg',
    });
  }
  initPinterestMeta() {
    this.meta.addTag({
      property: 'pinterest-rich-pin',
      content: 'true',
    });
  }
}
