import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: number = 0;
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  userRole: string = '';
  requestStatus: string = '';
  hasSubmittedRequest: boolean = false;

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.userId = parseInt(user.idUser, 10);
        this.username = user.username;
        this.userRole = user.role;
      }
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkRoleRequestStatus();
    }
  }

  updateProfile() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updateData = {
      userId: this.userId,
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost/internship/MyQuizi/backend/update_profile.php', updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .subscribe({
      next: (response) => {
        if (response.success) {
          alert('Profile updated successfully!');
        } else {
          alert('Update failed: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('An error occurred.');
      }
    });
  }

  submitRequest() {
    if (this.hasSubmittedRequest) {
      this.requestStatus = 'You have already submitted a request. Please wait for admin approval.';
      return;
    }

    this.http.post<any>('http://localhost/internship/MyQuizi/backend/request_role_change.php', { idUser: this.userId })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.hasSubmittedRequest = true;
            this.requestStatus = 'Your request has been submitted. Please wait for admin approval.';
          } else {
            alert('Request failed: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while submitting your request.');
        }
      });
  }

  private checkRoleRequestStatus() {
    this.http.get<any>(`http://localhost/internship/MyQuizi/backend/check_role_request.php?idUser=${this.userId}`)
      .subscribe({
        next: (response) => {
          if (response.exists) {
            this.hasSubmittedRequest = true;
            this.requestStatus = '';  // Clear the message if already submitted
          } else {
            this.requestStatus = '';  // Clear any existing message
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while checking request status.');
        }
      });
  }
}
