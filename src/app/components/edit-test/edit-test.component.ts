import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute and Router

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss'],
  standalone: true, // If this is a standalone component
  imports: [FormsModule] // Add FormsModule to imports
})
export class EditTestComponent implements OnInit {
  testId: number | null = null; // ID of the test being edited
  testTitle: string = ''; // Title of the test
  testDescription: string = ''; // Description of the test

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the testId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.testId = Number(params.get('testId'));
      if (this.testId) {
        this.loadTest();
      }
    });
  }

  loadTest(): void {
    // Fetch the test data from the backend
    this.http.get<any>(`http://localhost/internship/MyQuizi/backend/get_test.php?id=${this.testId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.testTitle = response.test.title;
            this.testDescription = response.test.description;
          } else {
            alert('Failed to load test: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while loading the test.');
        }
      });
  }


  saveChanges(): void {
    // Save the changes made to the test
    const updatedTest: { [key: string]: string | number | null } = {
      testId: this.testId,
      title: this.testTitle,
      description: this.testDescription
    };

    console.log('Data being sent to the server:', updatedTest); // Log the data

    // Convert object to URL-encoded string
    const body = new URLSearchParams();
    for (const key in updatedTest) {
      if (Object.prototype.hasOwnProperty.call(updatedTest, key)) {
        body.set(key, updatedTest[key]?.toString() || '');
      }
    }

    this.http.post<any>('http://localhost/internship/MyQuizi/backend/update_test.php', body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text' as 'json' // Set responseType to 'text' to log raw response
    })
    .subscribe({
      next: (response) => {
        console.log('Raw response from server:', response); // Log the raw response
        try {
          const jsonResponse = JSON.parse(response); // Attempt to parse the response
          console.log('Parsed response:', jsonResponse);
          if (jsonResponse.success) {
            alert('Test updated successfully!');
            this.router.navigate(['/layout/consult-tests']);
          } else {
            alert('Failed to update test: ' + jsonResponse.message);
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
          alert('An error occurred while updating the test.');
        }
      },
      error: (err) => {
        console.error('Error:', err);
        alert('An error occurred while updating the test.');
      }
    });
  }


}
