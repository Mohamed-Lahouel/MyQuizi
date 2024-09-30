import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-check-requests',
  templateUrl: './check-requests.component.html',
  styleUrls: ['./check-requests.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class CheckRequestsComponent implements OnInit {
  requests: any[] = []; // Property to hold the list of requests
  errorMessage: string | null = null; // Property to hold error messages

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  approveRequest(idRequest: number) {
    console.log('Approve button clicked for Request ID:', idRequest); // Log ID when approve is clicked
    this.sendRequest(idRequest, 'approve');
  }

  rejectRequest(idRequest: number) {
    console.log('Reject button clicked for Request ID:', idRequest); // Log ID when reject is clicked
    this.sendRequest(idRequest, 'reject');
  }

  private sendRequest(idRequest: number, action: string) {
    this.http.post<{ success: boolean, message: string }>(
      'http://localhost/internship/MyQuizi/backend/handle_request.php',
      { idRequest, action },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .subscribe(response => {
      console.log('Request response:', response);
      this.loadRequests(); // Refresh the request list after action
    }, error => {
      console.error('Error:', error);
      this.errorMessage = 'An error occurred while processing your request. Please try again later.';
    });
  }

  private loadRequests() {
    this.http.get<any[]>('http://localhost/internship/MyQuizi/backend/get_requests.php')
      .subscribe(data => {
        console.log('Fetched data:', data);
        this.requests = data;
      }, error => {
        console.error('Error loading requests:', error);
        this.errorMessage = 'An error occurred while loading requests. Please try again later.';
      });
  }
}
