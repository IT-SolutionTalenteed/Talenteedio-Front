import { Picture } from './picture';
import { Status } from './status.enum';

export interface Partner {
  id: string;
  title: string;
  slug: string;
  status: Status;
  image: Picture;
  link: string;
}
