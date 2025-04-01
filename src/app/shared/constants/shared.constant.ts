export const MALAGASY_PHONE_REGEX =
  /^((034)|(033)|(032)|(039)|(038)|(020)|(\+261?((33)|(32)|(34)|(39)|(38)|(20))))[0-9]{7,7}$/;

export const AIRTEL_MONEY_PHONE_REGEX = /^((033)|(\+261?((33))))[0-9]{7,7}$/;

export const MVOLA_PHONE_REGEX =
  /^((034)|(038)|(\+261?((34)|(38))))[0-9]{7,7}$/;

export const ORANGE_MONEY_PHONE_REGEX = /^((032)|(\+261?((32))))[0-9]{7,7}$/;

export const UNIVERSAL_PHONE_REGEX =
  // eslint-disable-next-line max-len
  /\s*(?:\+?(\d{1,3}))?[\W\D\s]^|()*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d)[\W\D\s]*(\d[\W\D\s]*?\d[\D\W\s]*?\d[\W\D\s]*?\d)(?: *x(\d+))?\s*$/;

export const NUMBER_REGEX = /[0-9]{2}$/;

export const PDF_GENERATION_API_ROUTE = 'pdf';

export const FACEBOOK_SHARE_BASE_URL =
  'https://www.facebook.com/sharer/sharer.php?u=';
export const TWITTER_SHARE_BASE_URL = 'https://twitter.com/share?url=';
export const PINTEREST_SHARE_BASE_URL = 'https://plus.google.com/share?url=';
export const LINKEDIN_SHARE_BASE_URL =
  'https://www.linkedin.com/shareArticle?mini=true&url=';

// export const CURRENCY_SHORT_LABEL: Record<Currency, string> = {
//     [Currency.ARIARY]: 'Ar',
//     [Currency.EURO]: '€',
//     [Currency.DOLLAR]: '$',
//     [Currency.RMB]: 'RMB',
// };

// export const CURRENCY_LABEL: Record<Currency, string> = {
//     [Currency.ARIARY]: 'Ariary',
//     [Currency.EURO]: 'Euro',
//     [Currency.DOLLAR]: 'Dollar',
//     [Currency.RMB]: 'RMB',
// };
