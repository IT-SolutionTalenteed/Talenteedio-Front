import { Job } from '../../shared/models/job.interface';

export enum FavoriteType {
  JOB = 'job',
  FREELANCE = 'freelance',
}

export interface Favorite {
  id: string;
  user: any;
  job?: Job;
  type: FavoriteType;
  createdAt: string;
}

export interface FavoriteResponse {
  success: boolean;
  message?: string;
  favorite?: Favorite;
}

export interface FavoritesResource {
  data: Favorite[];
  total: number;
  page: number;
  limit: number;
}
