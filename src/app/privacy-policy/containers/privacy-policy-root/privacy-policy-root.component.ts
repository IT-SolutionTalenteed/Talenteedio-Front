import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PrivacyPolicyState } from '../../store/reducers/privacy-policy.reducers';
import {
  getPrivacyPolicy,
  getPrivacyPolicyLoading,
} from '../../store/selectors/privacy-policy.selectors';

@Component({
  selector: 'app-privacy-policy-root',
  templateUrl: './privacy-policy-root.component.html',
  styleUrls: ['./privacy-policy-root.component.scss'],
})
export class PrivacyPolicyRootComponent implements OnInit {
  privacy$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(private privacyStore: Store<PrivacyPolicyState>) {}

  ngOnInit(): void {
    this.privacy$ = this.privacyStore.pipe(select(getPrivacyPolicy));
    this.loading$ = this.privacyStore.pipe(select(getPrivacyPolicyLoading));
  }
}
