import {UserType} from '../model/UserType';
import {Address} from '../model/Address';

export interface UserDto {
  id: number;
  username: string;
  phoneNumber: string;
  email: string;
  userType: UserType;
  firstname: string;
  lastname: string;
  cnp: string;
  dateOfBirth: Date;
  address: Address;
}
