import { Component } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordModal: boolean = false;
  userId: number = 0;

  constructor(private authService: AuthenticationService, private router: Router){}

  ngOnInit(){
    if (typeof window !== 'undefined') {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        this.authService.handleAuthCallback(code).subscribe(
          (response: any) => {
            console.log(response);
            if (response.message === 'Password!') {
              this.showPasswordModal = true; // Trigger the modal directly
              this.userId = response.userId;  // Store userId for password setup
            } else {
              localStorage.setItem('access_token', response.accessToken);
              localStorage.setItem('user_name', response.name);
              localStorage.setItem('role', response.role);
              this.router.navigate(['/products']);
            }
          },
          (error: any) => {
            console.error('Login failed:', error);
          }
        );
      }
    }
  }

  onLogin(): void {
    this.authService.redirectToGitHubLogin();
  }

  onEmailPasswordLogin(): void {
    this.authService.loginWithEmailPassword(this.email, this.password).subscribe(
      (response: any) => {
        console.log(response);
        if (response.message === 'Password') {
          this.userId = response.userId;
          this.showPasswordModal = true;
        } else {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('user_name', response.name);
          localStorage.setItem('role', response.role);
          this.router.navigate(['/products']);
        }
      },
      (error: any) => {
        console.error('Login failed:', error);
      }
    );
  }

  onSetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.authService.setPassword(this.userId, this.newPassword).subscribe(
      () => {
        this.showPasswordModal = false;
        this.router.navigate(['/products']);
      },
      (error: any) => {
        console.error('Password setup failed:', error);
      }
    );
  }
}
