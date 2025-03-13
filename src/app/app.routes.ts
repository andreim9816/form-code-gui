import {Routes} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {HomeComponent} from './routes/home/home.component';
import {CreateTemplateComponent} from './routes/create-template/create-template.component';
import {TestingComponent} from './routes/testing/testing.component';
import {DragdropComponent} from './routes/dragdrop/dragdrop.component';
import {CreateFormComponent} from './routes/create-form/create-form.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'templates', component: CreateTemplateComponent},
  {path: 'templates/:id', component: CreateFormComponent},
  {path: 'tests', component: TestingComponent},
  {path: 'drag-and-drop', component: DragdropComponent},
  {path: '**', redirectTo: ''}
];
