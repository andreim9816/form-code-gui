import {Routes} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {RegisterComponent} from './routes/register/register.component';
import {CreateTemplateComponent} from './routes/create-template/create-template.component';
import {EditFormComponent} from './routes/edit-form/edit-form.component';
import {UsersComponent} from './routes/users/users.component';
import {FormsComponent} from './routes/forms/forms.component';
import {CompaniesComponent} from './routes/companies/companies.component';
import {AuthGuard} from './guards/auth.guard';
import {NotLoggedInGuard} from './guards/not-logged-in.guard';
import {TemplatesComponent} from './routes/templates/templates.component';

export const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [NotLoggedInGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NotLoggedInGuard]},
  {path: 'create-template', component: CreateTemplateComponent, canActivate: [AuthGuard]},
  {path: 'templates', component: TemplatesComponent, canActivate: [AuthGuard]},
  {path: 'templates/:id', component: CreateTemplateComponent, canActivate: [AuthGuard]},
  {path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard]},
  {path: 'forms', component: FormsComponent, canActivate: [AuthGuard]},
  {path: 'forms/:id', component: EditFormComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];
