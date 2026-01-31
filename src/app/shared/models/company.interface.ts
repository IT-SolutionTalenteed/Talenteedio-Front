import { Contact } from './contact.interface';
import { Picture } from './picture';
import { Category, Job } from './job.interface';

export interface Company {
  id?: string;
  company_name: string;
  slug?: string;
  logo: Picture;
  contact: Contact;
  description?: string;
  slogan?: string;
  about?: string;
  headquarters?: string;
  category?: Category;
  categoryId?: string;
  website?: string;
  jobs?: Job[];
  socialNetworks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  address_line?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
}
