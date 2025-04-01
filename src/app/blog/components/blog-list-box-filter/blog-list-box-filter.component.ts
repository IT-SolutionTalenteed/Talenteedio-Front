import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EMPTY_BLOG_FILTER } from '../../constants/blog.constant';
import { ArticleFilter } from '../../types/article-filter.interface';

@Component({
  selector: 'app-blog-list-box-filter',
  templateUrl: './blog-list-box-filter.component.html',
  styleUrls: ['./blog-list-box-filter.component.scss'],
})
export class BlogListBoxFilterComponent {
  @Output() saveFilter: EventEmitter<ArticleFilter> = new EventEmitter<ArticleFilter>();

  faSearch = faSearch;

  form = this.initForm(EMPTY_BLOG_FILTER);
  constructor(private formBuilder: FormBuilder) {}
  onSubmit(form: FormGroup) {
    this.saveFilter.emit(form.value);
  }

  private initForm(filter: ArticleFilter): FormGroup {
    return this.formBuilder.group({
      search: [filter.search],
    });
  }
}
