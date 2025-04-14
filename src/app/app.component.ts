import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './routes/navbar/navbar.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './http/LoadingService';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NavbarComponent, RouterOutlet, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loading$: Observable<boolean>;

  constructor(public loader: LoadingService) {
    this.loading$ = this.loader.loading$;
  }

}
