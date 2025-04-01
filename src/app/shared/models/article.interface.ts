import { Picture } from './picture';
import { Status } from './status.enum';
import { User } from './user.interface';

export interface Article {
  id: string;
  title: string;
  content: string;
  status: Status;
  image: Picture;
  user: User | string;
  admin: {
    user: { name: string };
  } | null;
  company: {
    user: { name: string };
  } | null;
  createdAt: Date;
  slug: string;
  metaDescription: string;
  isPremium: boolean;
  publicContent: string;
}
