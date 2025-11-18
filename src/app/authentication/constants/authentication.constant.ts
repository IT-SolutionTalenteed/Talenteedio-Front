import { AngularIntlPhoneConfig } from 'angular-intl-phone';
import { environment } from 'src/environments/environment';

export const AUTHENTICATION_BASE_ROUTE = 'authentication';
export const SIGN_IN_ROUTE = '/authentication/sign-in';
export const SIGN_UP_ROUTE = '/authentication/sign-up';
export const SIGN_UP_CHOICE_ROUTE = '/authentication/sign-up-choice';

export const AUTHENTICATION_API_ROUTE = 'authentication';

export const CLIENT_NO_AUTH_API_ROUTE = 'client-no-auth';

export const REINIT_PASSWORD_API_ROUTE = 'reinit-password';

export const ACCOUNT_VALIDATION_API_ROUTE = 'account-activation';

export const EDIT_PROFILE_CLIENT = 'client';

export const PASSWORD_MIN_LENGTH = 4;

export const CONSENT_LINK = `${environment.publicBaseUrl}/assets/talent_consent.pdf`;

export const PHONE_CONFIG: AngularIntlPhoneConfig = {
  id: 'telphone',
  name: 'telphone',
  placeholder: 'Enter phone number',
  options: {
    initialCountry: 'fr',
    preferredCountries: ['fr', 'be', 'ch', 'ca'],
    separateDialCode: true,
    allowDropdown: true,
    autoPlaceholder: 'polite',
    formatOnDisplay: true,
  },
};
