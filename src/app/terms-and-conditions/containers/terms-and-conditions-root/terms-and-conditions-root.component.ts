import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TermsAndConditionsState } from '../../store/reducers/terms-and-conditions.reducers';
import {
  getTerms,
  getTermsLoading,
} from '../../store/selectors/terms-and-conditions.selectors';

@Component({
  selector: 'app-terms-and-conditions-root',
  templateUrl: './terms-and-conditions-root.component.html',
  styleUrls: ['./terms-and-conditions-root.component.scss'],
})
export class TermsAndConditionsRootComponent implements OnInit {
  terms$: Observable<string>;
  termsLoading$: Observable<boolean>;
  constructor(private termsStore: Store<TermsAndConditionsState>) {}
  ngOnInit(): void {
    this.terms$ = this.termsStore.pipe(select(getTerms));
    this.termsLoading$ = this.termsStore.pipe(select(getTermsLoading));
  }
}
