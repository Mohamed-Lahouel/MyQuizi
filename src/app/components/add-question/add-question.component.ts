import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  testId: number | null = null;

  questionText: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  correctOption: string = ''; // Initialize as an empty string

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the test ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.testId = parseInt(params.get('testId') || '0', 10);
    });
  }

  addQuestion() {
    if (this.testId && this.questionText && this.option1 && this.option2 && this.option3 && this.option4 && this.correctOption) {
      const questionData = {
        testId: this.testId,
        text: this.questionText,
        option1: this.option1,
        option2: this.option2,
        option3: this.option3,
        option4: this.option4,
        correctOption: this.correctOption
      };

      this.http.post('http://localhost/internship/MyQuizi/backend/add_questions.php', questionData)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              alert('Question added successfully!');
              this.resetFields();
            } else {
              alert('Failed to add question.');
            }
          },
          error: (error) => {
            console.error('Error adding question:', error);
            alert('An error occurred while adding the question.');
          }
        });
    } else {
      alert('Please fill in all fields.');
    }
  }

  resetFields() {
    this.questionText = '';
    this.option1 = '';
    this.option2 = '';
    this.option3 = '';
    this.option4 = '';
    this.correctOption = ''; // Reset the select dropdown to the default state
  }
  finishAddingQuestions(): void {
    // Navigate back to the view test page with the testId
    this.router.navigate([`/layout/view-test/${this.testId}`]);
  }
}
