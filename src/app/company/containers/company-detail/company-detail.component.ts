import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company.interface';
import { faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faBriefcase, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company$: Observable<Company>;
  loading = true;
  error: string = null;
  companySlug: string;

  faMapMarker = faMapMarkerAlt;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faGlobe = faGlobe;
  faBriefcase = faBriefcase;
  faBuilding = faBuilding;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.companySlug = this.route.snapshot.paramMap.get('slug');
    console.log('Company slug from route:', this.companySlug);
    this.loadCompany();
  }

  loadCompany(): void {
    this.loading = true;
    this.error = null;
    
    this.company$ = this.companyService.loadCompany(this.companySlug).pipe(
      tap({
        next: (company) => {
          console.log('Company loaded successfully in component:', company);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error in tap:', error);
          this.error = error.message || 'Une erreur est survenue';
          this.loading = false;
        }
      }),
      catchError(error => {
        console.error('Error in catchError:', error);
        this.error = error.message || 'Une erreur est survenue';
        this.loading = false;
        return of(null);
      }),
      shareReplay(1)
    );
    
    // Souscrire pour déclencher le chargement
    this.company$.subscribe({
      next: (company) => {
        console.log('Subscription next:', company);
      },
      error: (error) => {
        console.error('Subscription error:', error);
        this.error = error.message || 'Une erreur est survenue';
        this.loading = false;
      },
      complete: () => {
        console.log('Subscription complete');
      }
    });
  }
}
