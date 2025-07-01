import {Component} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {StorageService} from '../../service/StorageService';
import {AuthService} from '../../service/AuthService';
import {CreateCompanyComponent} from '../companies/create-company/create-company.component';
import {MatDialog} from '@angular/material/dialog';
import {HttpService} from '../../service/HttpService';

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
              private readonly httpService: HttpService,
              private readonly dialog: MatDialog,
              private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  canCreateTemplate(): boolean {
    return this.storageService.canCreateTemplate();
  }

  canValidateTemplate(): boolean {
    return this.storageService.canValidateTemplate();
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

  isCompanyAdmin(): boolean {
    const user = this.storageService.getUser();
    for(let company of user?.companies ?? []) {
      if (company.id === user?.currentCompanyId) {
        return true;
      }
    }
    return false;
  }

  openMyCompanyModal(): void {
    const user = this.storageService.getUser()!;
    this.httpService.getCompanyById(user?.currentCompanyId!).subscribe(company => {
       this.dialog.open(CreateCompanyComponent, {
        data: {
          company: company
        },
        width: '800px',
        maxWidth: '90vw',
      }).afterClosed().subscribe(() => {
        this.httpService.getUserById(user.id).subscribe(user => {
          this.storageService.saveUser(user);
        })
       });
    })
  }
}
