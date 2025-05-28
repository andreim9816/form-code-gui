import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {StorageService} from '../service/StorageService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService,
              private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
