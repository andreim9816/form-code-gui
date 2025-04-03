import {Section} from './Section';
import {Company} from './Company';

export interface Template {
  id: number;
  title: string;
  description: string;
  company: Company;
  companyId: number;
  companyName: string; //used in FormsComponent's ag-grid
  sections: Section[];
}
