import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TodosComponent } from './components/todos/todos';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './components/auth/auth';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'login', redirectTo: '/auth' },
  { path: 'register', redirectTo: '/auth' },
  { path: 'todos', component: TodosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/auth' }
];