import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consult-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './consult-tests.component.html',
  styleUrls: ['./consult-tests.component.scss']
})
export class ConsultTestsComponent {
  userTests: any[] = [];
  filteredTests: any[] = [];
  searchTerm: string = '';
  userId: number;

  constructor(private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.idUser;
  }

  ngOnInit(): void {
    this.getUserTests();
  }

  getUserTests(): void {
    const requestBody = { userId: this.userId };

    this.http.post<any>('http://localhost/internship/MyQuizi/backend/get_tests.php', requestBody)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.userTests = response.tests.map((test: any) => ({
              ...test,
              isPublished: test.published === '1'
            }));
            this.filteredTests = this.userTests;
          } else {
            alert('Failed to retrieve tests: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while fetching tests.');
        }
      });
  }

  searchTests(): void {
    const lowercasedSearchTerm = this.searchTerm.toLowerCase();
    this.filteredTests = this.userTests.filter(test =>
      test.title.toLowerCase().includes(lowercasedSearchTerm) ||
      test.description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }

  sortTests(criteria: string): void {
    this.filteredTests.sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
  }

  viewTest(testId: number): void {
    console.log('View Test ID:', testId);
    this.router.navigate(['/layout/view-test', testId]);
  }

  editTest(testId: number): void {
    this.router.navigate(['/layout/edit-test', testId]);
  }

  deleteTest(testId: number): void {
    if (confirm('Are you sure you want to delete this test?')) {
      this.http.post<any>('http://localhost/internship/MyQuizi/backend/delete_test.php', { testId })
        .subscribe({
          next: (response) => {
            if (response.success) {
              alert('Test deleted successfully.');
              this.getUserTests();
            } else {
              alert('Failed to delete test: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Error:', err);
            alert('An error occurred while deleting the test.');
          }
        });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([`/layout/${route}`]);
  }

  publishTest(testId: number): void {
    if (confirm('Are you sure you want to publish this test? You will no longer be able to edit it.')) {
      this.http.post<any>('http://localhost/internship/MyQuizi/backend/publish_test.php', { testId })
        .subscribe({
          next: (response) => {
            if (response.success) {
              alert('Test published successfully.');
              this.getUserTests();
            } else {
              alert('Failed to publish test: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Error:', err);
            alert('An error occurred while publishing the test.');
          }
        });
    }
  }

  checkResults(testId: number): void {
    console.log('Checking results for Test ID:', testId);
    this.router.navigate(['/layout/users-results', testId]);
  }
}
