import { Component } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Register } from '../../Models/Register';
import { register } from 'module';

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
  userRole: string = '';

  // Register
  showRegisterModal: boolean = false;
  registerEmail: string = '';
  registerUsername: string = '';
  registerPassword: string = '';

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
              localStorage.setItem('role', JSON.stringify(response.role.roleName));
              localStorage.setItem('email', response.email);

              this.userRole = response.role.roleName;
              this.accessCheck();
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

  accessCheck(): void {
    if (this.userRole === 'Product Manager') {
      this.router.navigate(['/products']);
    } else if (this.userRole === 'Product Capturer') {
      this.router.navigate(['/products']);
    } else if (this.userRole === 'Vendor') {
      this.router.navigate(['/vendor']);
    } else if(this.userRole === 'Customer'){
      this.router.navigate(['/customer']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onEmailPasswordLogin(email: string, password: string): void {
    this.email = email;
    this.password = password;
    this.authService.loginWithEmailPassword(this.email, this.password).subscribe(
      (response: any) => {
        console.log(response);
        if (response.message === 'Password') {
          this.userId = response.userId;
          this.showPasswordModal = true;
        } else {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('user_name', response.name);
          localStorage.setItem('role', JSON.stringify(response.role.roleName));
          localStorage.setItem('email', response.email);

          this.userRole = response.role.roleName;

          this.accessCheck();
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

        this.accessCheck();
      },
      (error: any) => {
        console.error('Password setup failed:', error);
      }
    );
  }

  Register(): void {
    var registerDetails = {
      email: this.registerEmail,
      username: this.registerUsername,
      password: this.registerPassword
    };
    console.log(registerDetails);
    this.authService.register(registerDetails).subscribe((result: any) => {
      console.log(result);
      console.log("Registered");
      this.onEmailPasswordLogin(this.registerEmail, this.registerPassword);
    },
  (error: any) => {
    console.log("Failed");
  })
  }

  onOpenRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }
}
