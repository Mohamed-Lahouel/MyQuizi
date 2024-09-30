import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule,FormsModule,NgIf,NgFor],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  userList: any[] = [];
  filteredUserList: any[] = []; // List to display filtered users
  sortColumn: string = '';
  sortDirection: string = 'asc';
  searchQuery: string = ''; // Property to bind to the search input

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.http.get<any[]>('http://localhost/internship/MyQuizi/backend/get_users.php').subscribe(
      (response) => {
        this.userList = response;
        this.filteredUserList = response; // Initially, show all users
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  searchUsers(): void {
    this.filteredUserList = this.userList.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  navigateToAddUser(): void {
    this.router.navigate(['/layout/create-user']);
  }

  changeRole(idUser: number, newRole: string): void {
    const requestBody = { idUser, newRole };
    this.http.post('http://localhost/internship/MyQuizi/backend/change_role.php', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.getUsers(); // Refresh user list
          console.log('Role updated successfully');
        } else {
          console.error('Error updating role:', response.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  deleteUser(idUser: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.post<any>('http://localhost/internship/MyQuizi/backend/delete_user.php', { idUser }).subscribe(
        (response) => {
          if (response.success) {
            this.getUsers(); // Refresh the user list
          } else {
            console.error('Error deleting user:', response.message);
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  sortUsers(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUserList.sort((a, b) => {
      let comparison = 0;
      if (a[column] > b[column]) {
        comparison = 1;
      } else if (a[column] < b[column]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}
