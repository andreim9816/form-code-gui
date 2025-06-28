import {Company} from './Company';
import {CompanyRole} from './CompanyRole';

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  companies: Company[];
  companyRoles: CompanyRole[];
}
