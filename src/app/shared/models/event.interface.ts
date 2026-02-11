import { Category } from './job.interface';
import { Status } from './status.enum';
import { User } from './user.interface';
import { Company } from './company.interface';

export interface Event {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: Date;
  metaDescription: string;
  status: Status;
  image?: string;
  admin?: { id: string; user: User };
  company?: Company;
  category: Category;
  companies?: Company[];
  createdAt: Date;
}
