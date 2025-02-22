import {Routes} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {HomeComponent} from './routes/home/home.component';
import {CreateTemplateComponent} from './routes/create-template/create-template.component';
import {TemplateStuffComponent} from './routes/template-stuff/template-stuff.component';
import {TestingComponent} from './routes/testing/testing.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'template', component: CreateTemplateComponent},
  {path: 'template-stuff', component: TemplateStuffComponent},
  {path: 'tests', component: TestingComponent},
  {path: '**', redirectTo: ''}
];
