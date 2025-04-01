import { Status } from './status.enum';

export interface Value {
  id: string;
  title: string;
  status: Status;
  createdAt: Date;
}
