import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-check-reports',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './check-reports.component.html',
  styleUrls: ['./check-reports.component.scss']
})

export class CheckReportsComponent implements OnInit {
  reports: any[] = [];
  private apiUrl = 'http://localhost/internship/MyQuizi/backend/get_reports.php';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const timestamp = new Date().getTime(); // Add timestamp to avoid caching issues
    this.http.get<any>(`${this.apiUrl}?t=${timestamp}`).subscribe(response => {
      console.log('Reports fetched:', response); // Debug statement
      if (response.success) {
        this.reports = response.data.map((report: any) => {
          // Perform any necessary data transformations here
          return report;
        });
        this.cdr.detectChanges(); // Trigger change detection
      } else {
        console.error('Failed to load reports:', response.message);
        this.reports = []; // Ensure reports is set to an empty array if no reports are found
      }
    }, error => {
      console.error('Error loading reports:', error);
      this.reports = []; // Ensure reports is set to an empty array in case of error
    });
  }

  deleteTest(testId: number): void {
    if (confirm('Are you sure you want to delete this test and its associated reports?')) {
      this.http.post<any>(`${this.apiUrl.replace('get_reports.php', 'delete_test_report.php')}`, { testId }).subscribe(response => {
        console.log('Delete response:', response); // Debug statement
        if (response.success) {
          alert('Test and associated reports deleted successfully.');
          this.loadReports(); // Reload reports after deletion
        } else {
          console.error('Failed to delete test:', response.message);
        }
      }, error => {
        console.error('Error deleting test:', error);
      });
    }
  }
}
