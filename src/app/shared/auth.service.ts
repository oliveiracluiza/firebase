import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  // Login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      if (res.user?.emailVerified) {
        localStorage.setItem('token', 'true');
        this.router.navigate(['/lista-tarefas']);
      } else {
        this.router.navigate(['/verify-email']);
      }
    }).catch(err => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }

  // Register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      alert('Registro feito com sucesso!');
      this.sendEmailForVerification(res.user);
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }

  // Sign out
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
    });
  }

  // Forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }).catch(err => {
      alert('Algo deu errado');
    });
  }

  // Send email for verification
  sendEmailForVerification(user: any) {
    user.sendEmailVerification().then(() => {
      this.router.navigate(['/verify-email']);
    }).catch((err: any) => {
      alert('Algo deu errado. Não conseguimos mandar a verificação para o seu email.');
    });
  }

  // Sign in with Google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
      this.router.navigate(['/lista-tarefas']);
    }).catch(err => {
      alert(err.message);
    });
  }
}
