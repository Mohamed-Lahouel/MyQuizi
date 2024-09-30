import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  async onSubmit() {
    this.email = this.email.trim();  // Trim any whitespace

    if (this.email === '') {
      alert('Please enter an email address.');
      return;
    }

    const formData = { email: this.email };

    try {
      // First check if the user exists
      const checkResponse = await this.http.post<any>('http://localhost/internship/MyQuizi/backend/check_user.php', formData).toPromise();
      if (checkResponse.success) {
        // User exists, now send the email with verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
        console.log('Verification Code:', verificationCode); // Log the verification code
        console.log('User ID:', checkResponse.idUser); // Log the user ID

        const sendResponse = await this.http.post<any>('http://localhost/internship/MyQuizi/backend/send_email.php', { email: this.email, idUser: checkResponse.idUser, verificationCode }).toPromise();
        if (sendResponse.success) {
          // Show alert and wait for user acknowledgment
          alert('Verification code has been sent to your email.');
          // Navigate to verification code component
// Navigate to verification code component with query parameters
this.router.navigate(['/code'], { queryParams: { idUser: checkResponse.idUser, verificationCode: verificationCode } });
        } else {
          alert(sendResponse.message || 'There was an error sending the verification code.');
        }
      } else {
        alert('No user found with this email address.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request.');
    }
  }
  navigateToLogin() {
    this.router.navigate(['/']);
  }

}
