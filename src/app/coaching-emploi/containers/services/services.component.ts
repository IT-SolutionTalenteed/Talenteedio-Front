import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  consultantName: string;
  contactData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultantName = this.route.snapshot.paramMap.get('consultant');
    // Récupérer les données de contact du sessionStorage
    const storedData = sessionStorage.getItem('coachingContactData');
    if (storedData) {
      this.contactData = JSON.parse(storedData);
    }
  }

  selectService(serviceType: 'bilan' | 'accompagnement') {
    // Rediriger vers la page de réservation
    this.router.navigate(['/coaching-emploi/booking', this.consultantName, serviceType]);
  }
}
