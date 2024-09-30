import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-passed-tests',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './passed-tests.component.html',
  styleUrls: ['./passed-tests.component.scss']
})
export class PassedTestsComponent implements OnInit {
  passedTests: any[] = [];
  filteredTests: any[] = [];
  searchTerm: string = '';
  private apiUrl = 'http://localhost/internship/MyQuizi/backend/get_passed_tests.php';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.idUser;

    if (userId) {
      this.http.get<any>(`${this.apiUrl}?userId=${userId}`)
        .subscribe(response => {
          // Log the entire response object
          console.log('API Response:', response);

          if (response.success) {
            this.passedTests = response.data;
            // Log the passed tests data
            console.log('Fetched tests:', this.passedTests);

            this.filteredTests = [...this.passedTests];
          } else {
            console.error('Failed to fetch passed tests:', response.message);
          }
        }, error => {
          console.error('Error fetching passed tests:', error);
        });
    } else {
      console.error('User ID is not available.');
    }
  }

  filterTests() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTests = this.passedTests.filter(test =>
      test.title.toLowerCase().includes(term) ||
      test.description.toLowerCase().includes(term) ||
      test.score.toString().includes(term)
    );
  }

  sortBy(property: string) {
    const sortedTests = [...this.filteredTests].sort((a, b) => {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
    this.filteredTests = sortedTests;
  }

  viewTest(subscriptionId: number) {
    this.router.navigate(['/layout/result'], { queryParams: { subscriptionId } });
  }

  reportTest(testId: number) {
    // Log and navigate to the report-test page with testId as a query parameter
    console.log('Navigating to report-test with Test ID:', testId);
    this.router.navigate(['/layout/report-test'], { queryParams: { testId } });
  }
}
