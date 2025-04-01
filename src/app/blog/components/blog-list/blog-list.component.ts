import { Component, Input } from '@angular/core';
import { Article } from 'src/app/shared/models/article.interface';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
  @Input() articles: Article[];
}
