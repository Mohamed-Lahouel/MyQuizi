import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost/internship/MyQuizi/backend/login.php', loginData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Store user information in localStorage
            localStorage.setItem('user', JSON.stringify(response.user)); // Assuming response.user contains user details including 'id'

            alert('Login successful!');
            this.router.navigate(['/layout']); // Redirect to the desired route after login
          } else {
            alert('Login failed: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred.');
        }
      });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
