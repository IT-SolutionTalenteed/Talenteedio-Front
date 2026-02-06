import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from 'src/app/routeur/store/actions/router.actions';

@Component({
  selector: 'app-sign-up-choice-root',
  templateUrl: './sign-up-choice-root.component.html',
  styleUrls: ['./sign-up-choice-root.component.scss'],
})
export class SignUpChoiceRootComponent {
  constructor(private store: Store) {}

  onChooseClient() {
    this.store.dispatch(go({ path: ['/authentication/sign-up'] }));
  }

  onChooseCompany() {
    this.store.dispatch(go({ path: ['/authentication/company-plan'] }));
  }

  onChooseConsultant() {
    this.store.dispatch(go({ path: ['/authentication/consultant-register'] }));
  }
}

