import { Article } from './article.interface';
import { Candidate } from './candidate.interface';
import { Recruiter } from './recruiter.interface';
import { Referral } from './referral.interface';
import { Role } from './role.interface';
import { Value } from './value.interface';
import { Picture } from './picture';
import { Company } from './company.interface';

export interface User {
  id: string;
  email: string;
  password?: string;
  lastname?: string;
  firstname?: string;
  name?: string;
  role: Role;
  roles: Role[];
  values: Value[];
  cvId: string;
  validateAt: Date;
  talent?: Candidate;
  referral?: Referral;
  recruiter?: Recruiter;
  company?: Company;
  consultant?: any;
  articles: Article[];
  isVerified: boolean;
  phone: string;
  profilePicture?: Picture;
}
