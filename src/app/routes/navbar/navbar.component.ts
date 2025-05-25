import {Component} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {StorageService} from '../../service/StorageService';
import {AuthService} from '../../service/AuthService';

@Component({
  selector: 'app-navbar',
  imports: [
    MatAnchor,
    MatToolbar,
    MatToolbarRow,
    NgIf,
    RouterLink,
    RouterLinkActive,
    MatButton
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private storageService: StorageService,
              private authService: AuthService,
              private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  canCreateTemplate(): boolean {
    return this.storageService.canCreateTemplate();
  }

  computeName(): string {
    return this.storageService.getUser()!.username;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.storageService.clearUser();
      this.router.navigate(['']);
    })
  }

  isAdmin(): boolean {
    return this.storageService.getUser()?.isAdmin === true;
  }

  isUser(): boolean {
    return !this.isAdmin();
  }
}
