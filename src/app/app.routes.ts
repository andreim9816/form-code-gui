import {Routes} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {HomeComponent} from './routes/home/home.component';
import {CreateTemplateComponent} from './routes/create-template/create-template.component';
import {TestingComponent} from './routes/testing/testing.component';
import {DragdropComponent} from './routes/dragdrop/dragdrop.component';
import {EditFormComponent} from './routes/edit-form/edit-form.component';
import {UsersComponent} from './routes/users/users.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'templates', component: CreateTemplateComponent},
  {path: 'forms/:id', component: EditFormComponent},
  {path: 'tests', component: TestingComponent},
  {path: 'users', component: UsersComponent},
  {path: 'drag-and-drop', component: DragdropComponent},
  {path: '**', redirectTo: ''}
];
