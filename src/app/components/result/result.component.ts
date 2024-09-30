import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface UserAnswersResponse {
  success: boolean;
  answers?: any[];
  message?: string; // Add optional message property
}

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  imports: [NgIf, NgFor,NgClass],
})
export class ResultComponent implements OnInit {
  questions: any[] = [];
  errorMessage: string | null = null;
  score: number | null = null;
  userAnswers: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const subscriptionId = params['subscriptionId'];
      if (subscriptionId) {
        this.fetchSubscriptionData(subscriptionId);
        this.fetchUserAnswers(subscriptionId);
      }
    });
  }

  private fetchSubscriptionData(subscriptionId: string): void {
    const url = `http://localhost/internship/MyQuizi/backend/get_subscription.php?subscriptionId=${subscriptionId}`;
    this.http.get<{ testId: number; score: number }>(url).subscribe(
      data => {
        if (data.testId) {
          this.fetchQuestions(data.testId);
          this.score = data.score;
        }
      },
      error => {
        console.error('Error fetching subscription data:', error);
      }
    );
  }

  private fetchQuestions(testId: number): void {
    const url = `http://localhost/internship/MyQuizi/backend/get_questionss.php?testId=${testId}`;
    this.http.get<{ success: boolean; questions: any[] }>(url).subscribe(
      data => {
        if (data.success) {
          this.questions = data.questions;
          console.log('Fetched questions:', this.questions);
        } else {
          this.errorMessage = 'Error fetching questions';
          console.error('Error fetching questions:', data);
        }
      },
      error => {
        this.errorMessage = 'An error occurred while fetching questions';
        console.error('Error fetching questions:', error);
      }
    );
  }

  private fetchUserAnswers(subscriptionId: string): void {
    const url = `http://localhost/internship/MyQuizi/backend/get_user_answers.php?subscriptionId=${subscriptionId}`;
    this.http.get<UserAnswersResponse>(url).subscribe(
      data => {
        if (data.success) {
          // Map userAnswers by questionId for easy access
          this.userAnswers = data.answers?.reduce((acc, answer) => {
            acc[answer.questionId] = answer;
            return acc;
          }, {}) || {};
          console.log('Fetched user answers:', this.userAnswers);
        } else {
          this.errorMessage = data.message || 'Error fetching user answers';
          console.error('Error fetching user answers:', this.errorMessage);
        }
      },
      error => {
        this.errorMessage = 'An error occurred while fetching user answers';
        console.error('Error fetching user answers:', error);
      }
    );
  }

}
