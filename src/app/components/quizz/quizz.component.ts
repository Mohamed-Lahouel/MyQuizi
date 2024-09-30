import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass]
})
export class QuizzComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  selectedOptions: { [questionId: number]: string } = {};
  userId: number | null = null;
  timer: number = 10; // Timer starts at 10 seconds
  timerSubscription: Subscription | null = null;
  alertAudio: HTMLAudioElement;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize audio
    this.alertAudio = new Audio('public/alert-sound.mp3');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const testId = params['testId'];
      if (testId) {
        this.fetchQuestions(testId);
      }
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = parseInt(user.idUser, 10); // Convert to number
      console.log('User ID:', this.userId); // Log user ID to the console
    } else {
      console.log('No user found in localStorage');
    }
  }

  fetchQuestions(testId: string): void {
    this.http.get<any>(`http://localhost/internship/MyQuizi/backend/get_all_questions.php?testId=${testId}`)
      .subscribe(
        response => {
          if (response.success) {
            this.questions = response.questions;
            this.questions.forEach(question => {
              this.selectedOptions[question.questionId] = ''; // Initialize state
            });
            this.startTimer();
          } else {
            console.error(response.message);
          }
        },
        error => {
          console.error('An error occurred:', error);
        }
      );
  }

  startTimer(): void {
    this.timer = 10; // Reset timer for each question
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Clean up any existing timer
    }
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timer--;
      if (this.timer <= 3 && this.timer > 0) {
        this.playAlertSound();
      }
      if (this.timer <= 0) {
        this.timer = 0;
        this.moveToNextQuestion(); // Automatically move to next question
      }
    });
  }

  playAlertSound(): void {
    if (!this.alertAudio.paused) {
      this.alertAudio.pause();
      this.alertAudio.currentTime = 0;
    }
    this.alertAudio.play();
  }

  selectOption(option: string): void {
    if (this.currentQuestion) {
      const questionId = this.currentQuestion.questionId;
      this.selectedOptions[questionId] = option;

      console.log('Selected options:', this.selectedOptions);

      this.moveToNextQuestion();
    }
  }

  moveToNextQuestion(): void {
    this.startTimer(); // Start timer for next question
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.endQuiz();
    }
  }

  endQuiz(): void {
    console.log('Quiz finished!');
    const score = this.calculateScore();

    if (this.userId !== null) {
      const resultData = {
        userId: this.userId,
        testId: this.currentQuestion?.testId,
        score: score,
        answers: this.questions.map(q => ({
          questionId: q.questionId,
          answer: this.selectedOptions[q.questionId]
        }))
      };

      console.log('Data to be sent:', resultData);

      this.http.post('http://localhost/internship/MyQuizi/backend/store_result.php', resultData)
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              // Retrieve the subscription ID from the response
              const subscriptionId = response.subscriptionId;

              // Navigate to the result page with the subscription ID as a query parameter
              this.router.navigate(['/layout/result'], { queryParams: { subscriptionId: subscriptionId } });
            } else {
              alert('Failed to save result.');
            }
          },
          error: (error) => {
            console.error('Error saving result:', error);
            alert('An error occurred while saving the result.');
          }
        });
    } else {
      alert('User ID is not available.');
    }
  }


  calculateScore(): number {
    let correctAnswers = 0;
    this.questions.forEach(question => {
      if (this.selectedOptions[question.questionId] === question.correctOption) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / this.questions.length) * 100); // Return score as a percentage
  }

  isOptionChecked(option: string): boolean {
    return this.selectedOptions[this.currentQuestion?.questionId] === option;
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  getQuestionNumber(): number {
    return this.currentQuestionIndex + 1; // Start numbering from 1
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Clean up timer on component destroy
    }
  }
}
