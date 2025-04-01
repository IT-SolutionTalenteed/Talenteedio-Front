import { Status } from './status.enum';
import { User } from './user.interface';

export interface Gest {
  id: string;
  name: string;
}

export interface Interview {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: Date;
  videoSrc: string;
  metaDescription: string;
  status: Status;
  admin: { id: string; user: User };
  createdAt: Date;
  guests: Gest[];
}
