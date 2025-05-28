import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './routes/navbar/navbar.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './http/LoadingService';
import {filter, Observable} from 'rxjs';
import {StorageService} from './service/StorageService';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NavbarComponent, RouterOutlet, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loading$: Observable<boolean>;

  showNavbar = true;
  hiddenRoutes = ['/', '/register'];

  constructor(public loader: LoadingService,
              private storageService: StorageService,
              private router: Router) {

    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/forms']);
    }

    this.loading$ = this.loader.loading$;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
