import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-registration-success',
  templateUrl: './company-registration-success.component.html',
  styleUrls: ['./company-registration-success.component.scss'],
})
export class CompanyRegistrationSuccessComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/authentication/login']);
  }
}
