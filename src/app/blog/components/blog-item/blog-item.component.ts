import { Component, Input } from '@angular/core';
import { faChevronRight, faCrown } from '@fortawesome/free-solid-svg-icons';
import { Article } from 'src/app/shared/models/article.interface';
@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
})
export class BlogItemComponent {
  @Input() article: Partial<Article>;
  readMoreIcon = faChevronRight;
  premiumIcon = faCrown;
}
