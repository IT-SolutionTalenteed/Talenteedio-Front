import { Image } from '../types/image.interface';
import { Contact } from './contact.interface';
import { Language } from './language.interface';

export interface Setting {
  siteTitle: string;
  siteDescription: string;
  favicon: string;
  language: Language;
  contact: Contact;
  terms: string;
  confidentiality: string;
  didYouKnow: string;
  gateway: string;
  voice: string;
  initiative: string;
  homeImage1: Image;
  homeImage2: Image;
  homeImage3: Image;
}
