import { Address } from './address.interface';
import { Status } from './status.enum';

export interface LocationJob {
  id: string;
  name: string;
  address: Address;
  status: Status;
}
