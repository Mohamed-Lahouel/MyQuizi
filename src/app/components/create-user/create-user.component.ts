import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CreateUserComponent {

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;
      this.http.post('http://localhost/internship/MyQuizi/backend/add_user.php', formData)
        .subscribe(
          (response: any) => {
            if (response.success) {
              alert('User added successfully!');
              this.router.navigate(['/layout/manage-users']);
            } else {
              alert('Error: ' + response.message);
            }
          },
          (error) => {
            console.error('Error adding user:', error);
            alert('An error occurred while adding the user.');
          }
        );
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
