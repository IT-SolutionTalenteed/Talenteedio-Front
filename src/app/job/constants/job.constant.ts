import {
  Gender,
  HourType,
  Job,
  Model,
  SalaryType,
} from 'src/app/shared/models/job.interface';
import { Skill } from 'src/app/shared/models/skill.interface';
import { Status } from 'src/app/shared/models/status.enum';

// const address: Address = {
//   id: '1',
//   line: 'line',
//   postalCode: 'postal code',
//   city: 'city',
//   country: 'country',
//   state: 'state',
// };

// const location: LocationJob = {
//   id: '1',
//   name: 'LocationJob name',
//   address,
//   status: Status.PUBLIC,
// };

// const featuredImage: Image = {
//   id: '1',
//   fileName: 'Avatar',
//   fileUrl: 'https://www.dhrb.lu/images/avatar.png',
//   fileType: 'fileType',
// };

const skills: Skill[] = [
  {
    id: '1',
    name: 'skill',
    status: Status.DRAFT,
  },
];

export const EMPTY_JOB: Job = {
  id: null,
  title: '',
  content: '',
  expirationDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  hours: 0,
  hourType: HourType.DAY,
  gender: Gender.BOTH,
  salaryMin: 0,
  salaryMax: 0,
  salaryType: SalaryType.DAILY,
  experience: 0,
  recruitmentNumber: 1,
  status: Status.DRAFT,
  location: {
    id: null,
    name: '',
    address: {
      id: null,
      line: '',
      postalCode: '',
      city: '',
      country: '',
      state: '',
    },
    status: Status.PUBLIC,
  },
  isFeatured: true,
  isUrgent: true,
  isSharable: false,
  featuredImage: {
    id: '1',
    fileName: 'Avatar',
    fileUrl: 'https://www.dhrb.lu/images/avatar.png',
    fileType: 'fileType',
  },
  jobType: {
    id: '1',
    name: 'Job type',
    status: Status.DRAFT,
  },
  skills,
  user: 'id_user',
  category: {
    id: '1',
    name: '',
    slug: '',
    status: Status.DRAFT,
    model: Model.ARTICLE,
  },
  hasApplied: false,
  slug: '',
  metaDescription: '',
};

export const JOB_FORM_BASE_ROUTE = '/job/detail';

export const JOB_DETAIL_ROUTE_REGEX =
  /\/\w+\/(\w)+\w+\/product\/form\/\w+\/\w+/;
