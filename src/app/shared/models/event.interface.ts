import { Category } from './job.interface';
import { Status } from './status.enum';
import { User } from './user.interface';

export interface Event {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: Date;
  metaDescription: string;
  status: Status;
  admin: { id: string; user: User };
  category: Category;
  createdAt: Date;
}
