import {CompanyRole} from './CompanyRole';
import {User} from './User';

export interface Company {
  id: number | undefined;
  name: string;
  companyRoles: CompanyRole[];
  adminUsers: User[];
}
