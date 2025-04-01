import { Contact } from 'src/app/shared/models/contact.interface';
import { ContactEmail } from '../types/contact-email.interface';

export const CONTACT_ROUTE = '/contact';

export const ADDRESS_MOCK: Contact = {
  address: {
    id: '',
    line: '10A, rue du Puits',
    postalCode: '',
    city: 'L-2355 Luxembourg',
    country: '',
    state: '',
  },
  email: 'tokiirazaka@gmail.com',
  phoneNumber: '+352 26 89 23 1',
  id: '',
};

export const EMPTY_EMAIL: ContactEmail = {
  name: '',
  email: '',
  subject: '',
  message: '',
};
