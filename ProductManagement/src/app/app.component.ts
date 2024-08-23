import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./productManagement/Components/login/login.component";
import { Router } from '@angular/router';
import { SidenavComponent } from "./productManagement/Components/sidenav/sidenav.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SidenavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProductManagement';
  showSidenav = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.showSidenav = !event.url.includes('/login');
      }
    })
  }
}
