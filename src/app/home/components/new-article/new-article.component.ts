import { Component, Input } from '@angular/core';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
})
export class NewArticleComponent {
  @Input() articles: Article[];
}
