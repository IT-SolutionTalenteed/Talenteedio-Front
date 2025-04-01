import { Component, Input } from '@angular/core';
import { Partner } from 'src/app/shared/models/partner.interface';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent {
  @Input() partners: Partial<Partner>[];
}
