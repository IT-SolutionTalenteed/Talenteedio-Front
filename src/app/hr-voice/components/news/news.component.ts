import { Component, Input } from '@angular/core';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  @Input() news: Partial<Partial<Article>[]>;
}
