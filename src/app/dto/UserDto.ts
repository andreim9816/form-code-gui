import { Company } from "../model/Company";
import {CompanyRole} from '../model/CompanyRole';

export interface UserDto {
  id: number;
  username: string;
  cnp: string;
  dateOfBirth: Date;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  address: string;
  companies: Company[];
  companyRoles: CompanyRole[];
}
