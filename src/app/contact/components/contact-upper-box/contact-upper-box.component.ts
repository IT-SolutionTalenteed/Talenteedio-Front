import { Component, Input } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact.interface';
import { ADDRESS_MOCK } from '../../constants/contact.constant';

@Component({
  selector: 'app-contact-upper-box',
  templateUrl: './contact-upper-box.component.html',
  styleUrls: ['./contact-upper-box.component.scss'],
})
export class ContactUpperBoxComponent {
  locationValue = ADDRESS_MOCK;
  @Input() set location(value: Contact | null) {
    this.locationValue = value || ADDRESS_MOCK;
  }
}
