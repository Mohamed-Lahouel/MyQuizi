import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { ConsultTestsComponent } from './components/consult-tests/consult-tests.component';
import { ViewTestComponent } from './components/view-test/view-test.component';
import { EditTestComponent } from './components/edit-test/edit-test.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { TakeTestComponent } from './components/take-test/take-test.component';
import { QuizzComponent } from './components/quizz/quizz.component';
import { ResultComponent } from './components/result/result.component';
import { PassedTestsComponent } from './components/passed-tests/passed-tests.component';
import { UsersResultsComponent } from './components/users-results/users-results.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ManageTestsComponent } from './components/manage-tests/manage-tests.component';
import { CheckRequestsComponent } from './components/check-requests/check-requests.component';
import { ReportTestComponent } from './components/report-test/report-test.component';
import { CheckReportsComponent } from './components/check-reports/check-reports.component';
import { CodeComponent } from './components/code/code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'quizz', component: QuizzComponent },
  { path: 'code', component: CodeComponent },
  { path: 'reset-password', component: ResetPasswordComponent }, // Redirect to home page if no route found

  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'create-test', component: CreateTestComponent },
      { path: 'add-question/:testId', component: AddQuestionComponent }, // Make sure this is correctly defined
      { path: 'consult-tests', component: ConsultTestsComponent },
      { path: 'view-test/:id', component: ViewTestComponent }, // Define route for viewing a test
      { path: 'edit-test/:testId', component: EditTestComponent },
      { path: 'edit-question/:questionId', component: EditQuestionComponent },
      { path: 'take-test', component: TakeTestComponent },
      { path: 'result', component: ResultComponent },
      { path: 'passed-tests', component: PassedTestsComponent },
      { path: 'users-results/:testId', component: UsersResultsComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'manage-tests', component: ManageTestsComponent },
      { path: 'check-requests', component: CheckRequestsComponent },
      { path: 'report-test', component: ReportTestComponent },
      { path: 'check-reports', component: CheckReportsComponent },





    ]
  }
];
