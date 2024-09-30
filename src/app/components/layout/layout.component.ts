import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,NgIf],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  userRole: string | null = null;

  constructor(private router: Router) {
    // Retrieve the user role from localStorage on component initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole = user.role;  // Assuming `user.role` contains 'student' or 'teacher'
    }
  }

  // Function to navigate to a specific route or handle logout
  navigateTo(route: string) {
    if (route === 'logout') {
      this.logout();
    } else {
      this.router.navigate([`/layout/${route}`]);
    }
  }

  // Handle user logout
  logout() {
    // Clear user information from localStorage
    localStorage.removeItem('user');

    // Redirect to login page
    this.router.navigate(['/']);
  }
}
