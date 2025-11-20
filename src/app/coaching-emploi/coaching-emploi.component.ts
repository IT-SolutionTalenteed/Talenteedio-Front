import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coaching-emploi',
  templateUrl: './coaching-emploi.component.html',
  styleUrls: ['./coaching-emploi.component.scss'],
})
export class CoachingEmploiComponent {
  showContactModal = false;

  constructor(private router: Router) {}

  openContactModal() {
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
  }

  onContactSubmit(contactData: any) {
    // Stocker les données de contact dans le sessionStorage
    sessionStorage.setItem('coachingContactData', JSON.stringify(contactData));
    this.showContactModal = false;
    // Rediriger vers la page des consultants
    this.router.navigate(['/coaching-emploi/consultants']);
  }
}
