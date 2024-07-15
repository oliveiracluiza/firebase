import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaTarefasComponent } from './pages/dashboard/lista-tarefas/lista-tarefas.component';
import { LoginComponent } from './pages/auth-system/login/login/login.component';
import { RegisterComponent } from './pages/auth-system/register/register/register.component';
import { ForgotPasswordComponent } from './pages/auth-system/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/auth-system/verify-email/verify-email.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'lista-tarefas', component: ListaTarefasComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
