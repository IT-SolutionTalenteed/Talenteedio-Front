export enum RoleName {
  ADMIN = 'admin',
  REFERRAL = 'referral',
  COMPANY = 'company',
  TALENT = 'talent',
  HR_FIRST_CLUB = 'hr-first-club',
}

export interface Role {
  id: string;
  name: RoleName;
  title: string;
}
