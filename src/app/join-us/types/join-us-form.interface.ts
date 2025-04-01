import { Event } from 'src/app/shared/models/event.interface';

export interface JoinUsForm {
  socialReason: string;
  address: string;
  firstName: string;
  lastName: string;
  professionalEmail: string;
  role: string;
  phone: string;
  motivation: string;
  events: Event[];
  otherTopics: string;
}
