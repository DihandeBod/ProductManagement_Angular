import { Component } from '@angular/core';
import { AppComponent } from "../../../app.component";
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [AppComponent, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  constructor(private authService: AuthenticationService, private router: Router) {}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
