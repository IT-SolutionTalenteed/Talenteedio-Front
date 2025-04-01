import { Contact } from './contact.interface';
import { Picture } from './picture';

export interface Company {
  company_name: string;
  logo: Picture;
  contact: Contact;
}
