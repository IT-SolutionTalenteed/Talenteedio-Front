import { Component, Input } from '@angular/core';
import { faChevronRight, faCrown } from '@fortawesome/free-solid-svg-icons';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-advisor-news',
  templateUrl: './advisor-news.component.html',
  styleUrls: ['./advisor-news.component.scss'],
})
export class AdvisorNewsComponent {
  @Input() news: Partial<Article>;
  readMoreIcon = faChevronRight;
  premiumIcon = faCrown;
}
