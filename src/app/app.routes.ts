import { Routes } from '@angular/router';
import {LoginComponent} from './routes/login/login.component';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];
