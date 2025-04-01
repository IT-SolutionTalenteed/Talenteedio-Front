import { Address } from './address.interface';

export interface Contact {
  id: string;
  phoneNumber: string;
  email: string;
  address: Address;
}
