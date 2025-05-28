import {Section} from './Section';
import {Company} from './Company';

export interface Template {
  id: number;
  title: string;
  description: string;
  createdDate: Date;
  company: Company;
  companyId: number;
  companyName: string; //used in FormsComponent's ag-grid
  creatorUserId: number;
  creatorUserFullName: string;
  sections: Section[];
}
