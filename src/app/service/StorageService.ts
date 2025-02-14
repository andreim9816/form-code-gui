import {Injectable} from '@angular/core';
import {UserDto} from "../model/UserDto";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  isLoggedIn(): boolean {
    return window.sessionStorage.getItem(USER_KEY) != null;
  }

  clearUser(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  saveUser(user: UserDto): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): UserDto {
    return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  }
}
