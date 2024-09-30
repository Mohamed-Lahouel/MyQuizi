import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {
  testTitle: string = '';
  testDescription: string = '';
  userId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = parseInt(user.idUser, 10); // Convert to number
    }
  }

  createTest() {
    if (this.userId && this.testTitle && this.testDescription) {
      const testData = {
        title: this.testTitle,
        description: this.testDescription,
        userId: this.userId
      };

      this.http.post('http://localhost/internship/MyQuizi/backend/create_test.php', testData)
        .subscribe({
          next: (response: any) => {
            if (response.success && response.testId) {
              alert('Test created successfully!');
              // Navigate to the add-question component with the testId
              this.router.navigate(['/layout/add-question', response.testId]);
            } else {
              alert('Failed to create test.');
            }
          },
          error: (error) => {
            console.error('Error creating test:', error);
            alert('An error occurred while creating the test.');
          }
        });
    } else {
      alert('Please fill in all fields.');
    }
  }
}
