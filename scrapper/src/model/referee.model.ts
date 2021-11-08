import { Court } from './court.model';

export interface Referee {
  name: string;
  surname: string;
  position: string;
  url: string;
  court: Court;
}
