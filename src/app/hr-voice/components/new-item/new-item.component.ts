import { Component, Input } from '@angular/core';
import { faChevronRight, faCrown } from '@fortawesome/free-solid-svg-icons';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss'],
})
export class NewItemComponent {
  @Input() news: Partial<Article>;
  readMoreIcon = faChevronRight;
  premiumIcon = faCrown;
}
