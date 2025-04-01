import { Component } from '@angular/core';
import { PRIVACY_POLICY_BASE_ROUTE } from 'src/app/privacy-policy/constants/privacy.constants';
import { TERMS_AND_CONDITIONS_BASE_ROUTE } from 'src/app/terms-and-conditions/constants/terms-and-conditions.constants';
import { FOOTER_LINKS } from '../../constants/root.constant';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  footerLinks = FOOTER_LINKS;
  termsAndConditionsRoute = TERMS_AND_CONDITIONS_BASE_ROUTE;
  privacyPolicyRoute = PRIVACY_POLICY_BASE_ROUTE;
}
