import {Injectable} from '@angular/core';
import {UserDto} from "../dto/UserDto";
import {Company} from '../model/Company';
import {CompanyRole} from '../model/CompanyRole';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  isLoggedIn(): boolean {
    const x = window.sessionStorage.getItem(USER_KEY);
    return x != null;
  }

  clearUser(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  saveUser(user: UserDto): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): UserDto | undefined {
    return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  }

  canCreateTemplate() {
    const user = this.getUser();
    if (!user) {
      return false;
    }
    let result = false;
    user.companies.forEach((comp: Company) => {
      comp.companyRoles.forEach((role: CompanyRole) => {
        if (role.createTemplate) {
          result = true;
        }
      });
    });
    return result;
  }
}
