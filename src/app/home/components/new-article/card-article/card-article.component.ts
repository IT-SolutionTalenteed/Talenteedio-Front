import { Component, Input } from '@angular/core';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-card-article',
  templateUrl: './card-article.component.html',
  styleUrls: ['./card-article.component.scss'],
})
export class CardArticleComponent {
  @Input() article: Article;
}
