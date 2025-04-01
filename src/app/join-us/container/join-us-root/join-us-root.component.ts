import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { sendEmail } from '../../store/actions/join-us.actions';
import { JoinUsState } from '../../store/reducers/join-us.reducers';
import {
  getEmailSent,
  getSendEmailLoading,
} from '../../store/selectors/join-us.selectors';
import { JoinUsForm } from '../../types/join-us-form.interface';

@Component({
  selector: 'app-join-us-root',
  templateUrl: './join-us-root.component.html',
  styleUrls: ['./join-us-root.component.scss'],
})
export class JoinUsRootComponent implements OnInit {
  sendEmailLoading$: Observable<boolean>;
  emailSent$: Observable<boolean>;
  constructor(private joinUsStore: Store<JoinUsState>) {}

  ngOnInit(): void {
    this.sendEmailLoading$ = this.joinUsStore.pipe(select(getSendEmailLoading));
    this.emailSent$ = this.joinUsStore.pipe(select(getEmailSent));
  }

  handleSend(event: JoinUsForm & { recaptcha: string }) {
    this.joinUsStore.dispatch(sendEmail(event));
  }
}
