import { Image } from '../types/image.interface';

export interface Ad {
  id: string;
  title: string;
  image: Image;
  link: string;
}
