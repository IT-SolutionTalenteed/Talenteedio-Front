import { Component, Input } from '@angular/core';
import { Page } from 'src/app/shared/types/page.interface';

@Component({
  selector: 'app-job-sort',
  templateUrl: './job-sort.component.html',
  styleUrls: ['./job-sort.component.scss']
})
export class JobSortComponent {
    @Input() totalItems: number;
    @Input() page: Page;
    @Input() jobLength: number;

}
