import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-view-test',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for Angular directives
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.scss']
})
export class ViewTestComponent implements OnInit {
  testId: number = 0; // Default value to satisfy TypeScript
  questions: any[] = []; // Array to hold questions data
  isPublished: boolean = false; // Variable to hold published status

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the testId
    this.route.paramMap.subscribe(params => {
      this.testId = Number(params.get('id')); // Convert to number if necessary
      this.fetchQuestions(); // Fetch questions based on the testId
    });
  }

  fetchQuestions(): void {
    this.http.post<any>('http://localhost/internship/MyQuizi/backend/get_test_questions.php', { testId: this.testId })
      .subscribe({
        next: (response) => {
          console.log('API Response:', response); // Log the entire response

          if (response.success) {
            this.questions = response.questions; // Assuming response contains a 'questions' array

            // Convert published value to number if needed
            const publishedValue = Number(response.published); // Convert to number explicitly
            this.isPublished = publishedValue === 1; // Compare to number

            // Log the published value and the boolean result
            console.log('Published Status:', publishedValue); // Log the raw published value
            console.log('Is Published Boolean:', this.isPublished); // Log the boolean result
          } else {
            console.error('Failed to retrieve questions:', response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
  }





  navigateToAddQuestions(): void {
    this.router.navigate(['/layout/add-question', this.testId]);
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.http.post<any>('http://localhost/internship/MyQuizi/backend/delete_question.php', { questionId })
        .subscribe({
          next: (response) => {
            if (response.success) {
              // Re-fetch the questions to ensure the list is up to date
              this.fetchQuestions();
              alert('Question deleted successfully.');
            } else {
              console.error('Failed to delete question:', response.message);
              alert('Failed to delete question: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Error:', err);
            alert('Error: ' + err.message);
          }
        });
    }
  }

  editQuestion(questionId: number): void {
    this.router.navigate(['/layout/edit-question', questionId]);
  }
}
