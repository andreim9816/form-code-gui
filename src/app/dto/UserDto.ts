import { Company } from "../model/Company";

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
}
