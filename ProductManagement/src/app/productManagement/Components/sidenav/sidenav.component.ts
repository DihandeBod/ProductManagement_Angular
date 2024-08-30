import { Component } from '@angular/core';
import { AppComponent } from "../../../app.component";
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [AppComponent, RouterModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  userRole: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(){
    if (typeof window !== 'undefined' && window.localStorage) {
      const userRoleStr = localStorage.getItem("role");
      if (userRoleStr) {
        this.userRole = JSON.parse(userRoleStr);
        // console.log(this.userRole);
      } else {
        this.router.navigate(['/login']); 
      }
    } else {
      console.warn('localStorage is not available.');
      this.router.navigate(['/login']);
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
