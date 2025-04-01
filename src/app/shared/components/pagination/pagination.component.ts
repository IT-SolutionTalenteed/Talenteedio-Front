import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Page } from '../../types/page.interface';

const PAGINATOR_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 10, 20, 30, 40, 50, 60];

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number;
  @Output() paginate: EventEmitter<Page> = new EventEmitter<Page>();
  @Input() set initialValue(page: Page) {
    if (page) {
      this.page = page.page;
      this.pageSize = this.pageSizeOptions.includes(page.pageSize)
        ? page.pageSize
        : this.pageSizeOptions[0];
    }
  }
  page = 1;
  pageSize = PAGE_SIZE_OPTIONS[0];
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  pages: number[] = [];
  nbPage: number;
  start: number;
  end: number;
  max = 60;

  ngOnChanges() {
    this.updatePages();
  }

  setPage(page: number) {
    this.page = page;
    this.paginate.emit({
      page: this.page,
      pageSize: +this.pageSize,
    });
    this.updatePages();
  }

  morePagesForward() {
    this.setPage(this.end + Math.ceil(PAGINATOR_SIZE / 2));
  }

  morePagesBackward() {
    this.setPage(this.start - Math.ceil(PAGINATOR_SIZE / 2));
  }

  private generatePages(start: number, end: number): number[] {
    return Array.from(new Array(end + 1 - start), (x, i) => start + i);
  }

  private updatePages() {
    this.nbPage = Math.ceil(this.totalItems / this.pageSize);
    this.validatePage();
    if (this.nbPage === 0) {
      this.pages = [];
    } else if (this.page <= PAGINATOR_SIZE) {
      this.start = 1;
      this.end = this.nbPage > PAGINATOR_SIZE ? PAGINATOR_SIZE : this.nbPage;
      this.pages = this.generatePages(this.start, this.end);
    } else if (this.page + PAGINATOR_SIZE / 2 < this.nbPage) {
      this.start = Math.ceil(this.page - PAGINATOR_SIZE / 2);
      this.end = Math.ceil(this.page + PAGINATOR_SIZE / 2 - 1);
      this.pages = this.generatePages(this.start, this.end);
    } else {
      this.start = this.nbPage + 1 - PAGINATOR_SIZE;
      this.end = this.nbPage;
      this.pages = this.generatePages(this.start, this.end);
    }
  }

  private validatePage() {
    this.page > this.nbPage && (this.page = this.nbPage);
    this.page < 1 && (this.page = 1);
  }

  onIncrementPageSize(value): void {
    this.pageSize = value;
    this.setPage(1);
  }

  onDecrementPageSize(value): void {
    this.pageSize = value;
    this.setPage(1);
  }
}
