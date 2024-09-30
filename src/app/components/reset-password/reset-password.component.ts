import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  idUser: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idUser = params['idUser'];
    });
  }

  async onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!this.idUser) {
      alert('Invalid request.');
      return;
    }

    const formData = { idUser: this.idUser, newPassword: this.newPassword };

    try {
      const response = await this.http.post<any>('http://localhost/internship/MyQuizi/backend/reset_password.php', formData).toPromise();
      if (response.success) {
        alert('Password reset successfully.');
        this.router.navigate(['/']);
      } else {
        alert(response.message || 'There was an error resetting the password.');
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
