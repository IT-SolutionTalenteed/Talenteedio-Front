import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PricingService, Pricing } from '../../services/pricing.service';
import { ConsultantService, Consultant } from '../../services/consultant.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  consultantName: string;
  consultantData: Consultant | null = null;
  contactData: any;
  pricings: Pricing[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: PricingService,
    private consultantService: ConsultantService
  ) {}

  ngOnInit(): void {
    this.consultantName = this.route.snapshot.paramMap.get('consultant');
    // Récupérer les données de contact du sessionStorage
    const storedData = sessionStorage.getItem('coachingContactData');
    if (storedData) {
      this.contactData = JSON.parse(storedData);
    }
    
    this.loadConsultantData();
    this.loadPricings();
  }

  loadConsultantData(): void {
    if (this.consultantName && !this.isStaticConsultant()) {
      this.consultantService.getConsultantById(this.consultantName).subscribe({
        next: (consultant) => {
          this.consultantData = consultant;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du consultant:', error);
        }
      });
    }
  }

  // Vérifier si c'est un consultant statique (Guy ou Kerian)
  isStaticConsultant(): boolean {
    return this.consultantName === 'guy' || this.consultantName === 'kerian';
  }

  loadPricings(): void {
    this.loading = true;
    this.error = null;
    
    // Si c'est un consultant statique, ne pas charger de tarifs dynamiques
    if (this.isStaticConsultant()) {
      this.pricings = [];
      this.loading = false;
      return;
    }
    
    // Si on a un consultantName (ID du consultant), récupérer ses tarifs spécifiques
    if (this.consultantName) {
      this.pricingService.getPricingsByConsultant(this.consultantName).subscribe({
        next: (response) => {
          this.pricings = response.data.result.rows;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des tarifs:', error);
          this.error = 'Erreur lors du chargement des tarifs';
          this.loading = false;
        }
      });
    } else {
      // Si pas de consultant spécifique, récupérer tous les tarifs
      this.pricingService.getAllPricings().subscribe({
        next: (response) => {
          this.pricings = response.data.result;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des tarifs:', error);
          this.error = 'Erreur lors du chargement des tarifs';
          this.loading = false;
        }
      });
    }
  }

  selectService(serviceType: 'bilan' | 'accompagnement') {
    // Rediriger vers la page de réservation
    this.router.navigate(['/coaching-emploi/booking', this.consultantName, serviceType]);
  }

  selectPricing(pricing: Pricing) {
    // Stocker les informations du service sélectionné dans sessionStorage
    const consultantId = pricing.consultant?.id || this.consultantName;
    const serviceData = {
      pricingId: pricing.id,
      title: pricing.title,
      description: pricing.description,
      price: pricing.price,
      unit: pricing.unit,
      duration: pricing.duration,
      features: pricing.features,
      consultant: {
        id: consultantId,
        name: this.getConsultantDisplayName(pricing)
      }
    };
    
    sessionStorage.setItem('selectedServiceData', JSON.stringify(serviceData));
    
    // Rediriger vers la page de réservation du consultant spécifique
    this.router.navigate(['/coaching-emploi/booking', consultantId]);
  }

  formatPrice(price: number, unit?: string): string {
    const formattedPrice = `${price}€`;
    if (unit) {
      switch (unit) {
        case 'hour':
          return `${formattedPrice}/h`;
        case 'day':
          return `${formattedPrice}/jour`;
        case 'project':
          return `${formattedPrice}/projet`;
        case 'session':
          return `${formattedPrice}/séance`;
        default:
          return `${formattedPrice}/${unit}`;
      }
    }
    return formattedPrice;
  }

  getConsultantDisplayName(pricing: Pricing): string {
    // Priorité 1: Données du pricing
    if (pricing.consultant?.user) {
      return `${pricing.consultant.user.firstname} ${pricing.consultant.user.lastname}`;
    }
    
    // Priorité 2: Données du consultant chargées séparément
    if (this.consultantData?.user) {
      return `${this.consultantData.user.firstname} ${this.consultantData.user.lastname}`;
    }
    
    // Fallback
    return 'Consultant';
  }
}
