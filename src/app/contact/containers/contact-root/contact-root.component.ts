import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/shared/models/contact.interface';
import { SharedState } from 'src/app/shared/store/reducers/shared.reducers';
import { getLocation } from 'src/app/shared/store/selectors/shared.selectors';
import { SubSink } from 'subsink';
import { ADDRESS_MOCK } from '../../constants/contact.constant';
import { sendEmail } from '../../store/actions/contact.actions';
import { ContactState } from '../../store/reducers/contact.reducers';
import {
  getEmailSent,
  getSendEmailLoading,
} from '../../store/selectors/contact.selectors';
import { ContactEmail } from '../../types/contact-email.interface';

@Component({
  selector: 'app-contact-root',
  templateUrl: './contact-root.component.html',
  styleUrls: ['./contact-root.component.scss'],
})
export class ContactRootComponent implements OnInit, OnDestroy {
  sendMailLoading$: Observable<boolean>;
  location$: Observable<Contact | null>;
  destination: string;
  emailSent$: Observable<boolean>;
  private subs = new SubSink();

  constructor(
    private contactStore: Store<ContactState>,
    private sharedStore: Store<SharedState>
  ) {}
  ngOnInit() {
    this.sendMailLoading$ = this.contactStore.pipe(select(getSendEmailLoading));
    this.location$ = this.sharedStore.pipe(select(getLocation));
    this.subs.sink = this.location$.subscribe((location) => {
      this.destination = location?.email || ADDRESS_MOCK.email;
    });
    this.emailSent$ = this.contactStore.pipe(select(getEmailSent));
  }
  onSendMail(emailForm: ContactEmail) {
    this.contactStore.dispatch(
      sendEmail({ ...emailForm, to: this.destination })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
