import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss']
})
export class TakeTestComponent {
  testCode: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  startTest() {
    if (this.testCode.trim()) {
      // Make HTTP GET request to check if test code exists
      this.http.get(`http://localhost/internship/MyQuizi/backend/check_test_code.php?code=${this.testCode}`)
        .subscribe((response: any) => {
          if (response.success) {
            // Navigate to the quiz page with the testId as a query parameter
            this.router.navigate(['/quizz'], { queryParams: { testId: response.testId } });
          } else {
            alert(response.message);
          }
        }, error => {
          alert('An error occurred. Please try again later.');
        });
    } else {
      alert('Please enter a valid test code.');
    }
  }
}
