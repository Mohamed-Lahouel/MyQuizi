import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-report-test',
  templateUrl: './report-test.component.html',
  styleUrls: ['./report-test.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule]
})
export class ReportTestComponent implements OnInit {
  testId: number | null = null;
  report = {
    reason: '',
    description: '',
  };
  reasons: string[] = ['Incorrect Content', 'Technical Issue', 'Other']; // List of reasons

  private apiUrl = 'http://localhost/internship/MyQuizi/backend/submit_report.php';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.testId = +params['testId'] || null; // Convert to number
      console.log('Received testId:', this.testId);
    });
  }

  submitReport(form: NgForm) {
    if (form.valid && this.testId) {
      // Assuming you have the user ID available in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.idUser;

      if (!userId) {
        console.error('User ID is not available.');
        return;
      }

      const reportData = {
        testId: this.testId,
        userId: userId,
        reason: this.report.reason,
        description: this.report.description
      };

      this.http.post<any>(this.apiUrl, reportData)
        .subscribe(response => {
          if (response.success) {
            alert('Report submitted successfully.');
            this.router.navigate(['/layout/passed-tests']); // Redirect to another page if needed
          } else {
            console.error('Failed to submit report:', response.message);
          }
        }, error => {
          console.error('Error submitting report:', error);
        });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
