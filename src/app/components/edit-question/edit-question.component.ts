import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class EditQuestionComponent implements OnInit {
  questionId: number | null = null;
  testId: number | null = null; // Add this line
  questionText: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  correctOption: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.questionId = Number(params.get('questionId'));
      this.testId = Number(params.get('testId')); // Fetch testId from route

      console.log('Question ID:', this.questionId);
      if (this.questionId) {
        this.loadQuestionDetails();
      } else {
        console.warn('No questionId found in route parameters.');
      }
    });
  }

  loadQuestionDetails(): void {
    if (this.questionId) {
      this.http.get<{ success: boolean; questions: { questionId: number; text: string; option1: string; option2: string; option3: string; option4: string; correctOption: string;testId:number; }[] }>(
        `http://localhost/internship/MyQuizi/backend/get_question_details.php?questionId=${this.questionId}`
      ).subscribe({
        next: (response) => {
          console.log('Response:', response);
          if (response.success && response.questions.length > 0) {
            const question = response.questions[0];
            this.questionText = question.text;
            this.option1 = question.option1;
            this.option2 = question.option2;
            this.option3 = question.option3;
            this.option4 = question.option4;
            this.correctOption = question.correctOption;
            this.testId = question.testId;

          } else {
            console.warn('Failed to load question details or no question found.');
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while loading the question details.');
        }
      });
    }
  }

  updateQuestion(): void {
    if (this.questionId) {
      const updatedQuestion = {
        questionId: this.questionId,
        text: this.questionText,
        option1: this.option1,
        option2: this.option2,
        option3: this.option3,
        option4: this.option4,
        correctOption: this.correctOption
      };

      this.http.put<{ success: boolean; message: string }>(
        'http://localhost/internship/MyQuizi/backend/update_question.php',
        updatedQuestion
      ).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Question updated successfully!');
            this.router.navigate(['/layout/view-test', this.testId]);
          } else {
            alert('Failed to update question: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          alert('An error occurred while updating the question.');
        }
      });
    }
  }


}
