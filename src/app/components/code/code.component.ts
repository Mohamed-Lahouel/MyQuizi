import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CodeComponent implements OnInit {
  enteredCode: string = '';
  idUser: string | null = null;
  verificationCode: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idUser = params['idUser'];
      this.verificationCode = params['verificationCode'];
    });
  }

  async onSubmit() {
    if (this.enteredCode === '') {
      alert('Please enter the verification code.');
      return;
    }

    if (this.enteredCode === this.verificationCode) {
      // Verification successful, proceed with the password reset or other actions
      alert('Code verified successfully.');
      // Example: Navigate to a password reset component
      this.router.navigate(['/reset-password'], { queryParams: { idUser: this.idUser } });
    } else {
      alert('Invalid verification code.');
    }
  }
  navigateToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}
