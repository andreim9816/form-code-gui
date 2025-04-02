import {UserType} from './UserType';
import {Company} from './Company';
import {CompanyRole} from './CompanyRole';

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  userTypes: UserType[];
  companies: Company[];
  companyRoles: CompanyRole[];
}
