import { Component, Input } from '@angular/core';
import { Page } from 'src/app/shared/types/page.interface';

@Component({
  selector: 'app-freelance-sort',
  templateUrl: './freelance-sort.component.html',
  styleUrls: ['./freelance-sort.component.scss']
})
export class FreelanceSortComponent {
    @Input() totalItems: number;
    @Input() page: Page;
    @Input() jobLength: number;
}
