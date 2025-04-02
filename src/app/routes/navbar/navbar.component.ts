import {Component} from '@angular/core';
import {MatAnchor} from "@angular/material/button";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {BreakpointObserver} from '@angular/cdk/layout';
import {StorageService} from '../../service/StorageService';
import {AuthService} from '../../service/AuthService';
import {UserType} from '../../model/UserType';

@Component({
  selector: 'app-navbar',
  imports: [
    MatAnchor,
    MatToolbar,
    MatToolbarRow,
    NgIf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private breakpointObserver: BreakpointObserver,
              private storageService: StorageService,
              private authService: AuthService,
              private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  computeName(): string {
    return this.storageService.getUser().username;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.storageService.clearUser();
      this.router.navigate(['/']);
    })
  }

  isAdmin(): boolean {
    return this.storageService.getUser().userType === UserType.ADMIN;
  }

  isUser(): boolean {
    return this.storageService.getUser().userType === UserType.USER;
  }
}
