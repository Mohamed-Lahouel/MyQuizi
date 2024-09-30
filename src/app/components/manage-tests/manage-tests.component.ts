import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Define the structure of the response from the delete API
interface DeleteResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-manage-tests',
  standalone: true,
  imports: [NgIf, NgFor,FormsModule],
  templateUrl: './manage-tests.component.html',
  styleUrls: ['./manage-tests.component.scss']
})
export class ManageTestsComponent implements OnInit {
  tests: any[] = [];
  filteredTests: any[] = [];
  private apiUrl = 'http://localhost/internship/MyQuizi/backend/get_all_tests.php'; // Your API endpoint
  private deleteUrl = 'http://localhost/internship/MyQuizi/backend/delete_test.php'; // Your delete endpoint

  sortColumn: string = '';
  sortDirection: string = 'asc';
  searchQuery: string = ''; // Property to bind to the search input

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchTests();
  }

  fetchTests(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.tests = data.map((test: any) => {
        // Check if published is a string and convert it to number if necessary
        const publishedValue = typeof test.published === 'string' ? parseInt(test.published, 10) : test.published;
        const isPublished = publishedValue === 1; // Convert published to a boolean value

        return {
          ...test,
          isPublished: isPublished
        };
      });

      this.filteredTests = this.tests; // Initially, show all tests
    }, error => {
      console.error('Error fetching tests:', error);
    });
  }

  searchTests(): void {
    this.filteredTests = this.tests.filter(test =>
      test.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      test.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  sortTests(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredTests.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  viewTest(testId: number): void {
    this.router.navigate(['/layout/view-test', testId]);
  }

  deleteTest(testId: number): void {
    this.http.post<DeleteResponse>(this.deleteUrl, { testId }).subscribe(response => {
      if (response.success) {
        alert('Test deleted successfully.');
        this.fetchTests(); // Refresh the test list
      } else {
        alert('Failed to delete test: ' + response.message);
      }
    }, error => {
      console.error('Error deleting test:', error);
      alert('Error deleting test. Please try again.');
    });
  }

  checkResults(testId: number): void {
    this.router.navigate(['/layout/users-results', testId]);
  }
}
