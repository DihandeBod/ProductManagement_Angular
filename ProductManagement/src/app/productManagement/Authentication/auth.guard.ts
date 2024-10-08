import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Get the JWT from local storage
  const token = authService.getToken();

  if (token) {
    // Decode the token and extract the role
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role; 

    // Check if the user's role matches the required role for this route
    const requiredRoles = route.data['role'] as Array<string>;

    if (requiredRoles.includes(userRole)) {
      console.log("Authorized");
      return true;
    } else {
      // If role doesn't match, redirect to an unauthorized page or login
      Swal.fire({
        title: 'Access Denied',
        text: 'You do not have the necessary permissions to access this page.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      console.log("Unauthorized Access");
      return false;
    }
  } else {
    // If no token, redirect to login
    Swal.fire({
      title: 'Access Denied',
      text: 'No security token found.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    console.log("No token found, redirecting to login");
    router.navigate(['/login']);
    return false;
  }
};
