import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class SignupComponent {
  private signupUrl = 'http://localhost/internship/MyQuizi/backend/signup.php';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { username, email, password, confirm_password } = form.value;

      console.log('Form data:', { username, email, password, confirm_password }); // Log form data

      if (password === confirm_password) {
        this.http.post(this.signupUrl, { username, email, password }).subscribe({
          next: (response: any) => {
            console.log('Server response:', response); // Log server response
            if (response.success) {
              this.router.navigate(['/']);
            } else {
              alert(response.message);
            }
          },
          error: (err) => {
            console.error('HTTP Error:', err); // Log HTTP error
            if (err.error && err.error.message) {
              alert(err.error.message); // Display specific error message if available
            } else {
              alert('An error occurred. Please try again.');
            }
          }
        });
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }
  navigateToLogin() {
    this.router.navigate(['/']);
  }
}
