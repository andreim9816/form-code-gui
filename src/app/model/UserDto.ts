import {UserType} from './UserType';

export interface UserDto {
  id: number;
  username: string;
  phoneNumber: string;
  email: string;
  userType: UserType;
}
