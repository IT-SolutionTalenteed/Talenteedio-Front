import { Component, Input } from '@angular/core';
import { Company } from 'src/app/shared/models/company.interface';

@Component({
  selector: 'app-top-company',
  templateUrl: './top-company.component.html',
  styleUrls: ['./top-company.component.scss'],
})
export class TopCompanyComponent {
  @Input() companies: Company[];
}
