import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';  // Import Router


@Component({
  selector: 'app-users-results',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './users-results.component.html',
  styleUrls: ['./users-results.component.scss']
})
export class UsersResultsComponent implements OnInit {
  results: any[] = [];
  testId: number | null = null;

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    // Get the testId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.testId = Number(params.get('testId'));

      if (this.testId) {
        // Fetch the data
        fetch(`http://localhost/internship/MyQuizi/backend/get_users_results.php?testId=${this.testId}`)
          .then(response => response.json())
          .then(data => {
            this.results = data;
          })
          .catch(error => {
            console.error('Error fetching user results:', error);
          });
      }
    });
  }

  viewUser(result: any): void {
    // Log the subscription ID to the console
    console.log('Subscription ID:', result.subscriptionId);
  }
  viewTest(subscriptionId: number) {
    this.router.navigate(['/layout/result'], { queryParams: { subscriptionId } });
  }
}
