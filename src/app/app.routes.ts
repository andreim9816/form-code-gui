import {Routes} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {RegisterComponent} from './routes/register/register.component';
import {CreateTemplateComponent} from './routes/create-template/create-template.component';
import {TestingComponent} from './routes/testing/testing.component';
import {DragdropComponent} from './routes/dragdrop/dragdrop.component';
import {EditFormComponent} from './routes/edit-form/edit-form.component';
import {UsersComponent} from './routes/users/users.component';
import {FormsComponent} from './routes/forms/forms.component';
import {CompaniesComponent} from './routes/companies/companies.component';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-template', component: CreateTemplateComponent, canActivate: [AuthGuard]},
  {path: 'companies', component: CompaniesComponent, canActivate: [AuthGuard]},
  {path: 'forms', component: FormsComponent, canActivate: [AuthGuard]},
  {path: 'forms/:id', component: EditFormComponent, canActivate: [AuthGuard]},
  {path: 'tests', component: TestingComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'drag-and-drop', component: DragdropComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];
