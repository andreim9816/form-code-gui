import {CompanyRole} from './CompanyRole';
import {User} from './User';

export interface Company {
  id: number;
  name: string;
  companyRoles: CompanyRole[];
  adminUsers: User[];
}
