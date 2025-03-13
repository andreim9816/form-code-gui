import {Section} from './Section';
import {Company} from './Company';

export interface Template {
  id: number;
  title: string;
  description: string;
  company: Company;
  sections: Section[];
}
