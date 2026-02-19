import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, shareReplay, catchError, switchMap } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company.interface';
import { faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faBriefcase, faBuilding, faCalendar, faNewspaper, faBriefcase as faJobIcon } from '@fortawesome/free-solid-svg-icons';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company$: Observable<Company>;
  events$: Observable<any[]>;
  articles$: Observable<any[]>;
  jobs$: Observable<any[]>;
  
  loading = true;
  error: string = null;
  companySlug: string;

  faMapMarker = faMapMarkerAlt;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faGlobe = faGlobe;
  faBriefcase = faBriefcase;
  faBuilding = faBuilding;
  faCalendar = faCalendar;
  faNewspaper = faNewspaper;
  faJobIcon = faJobIcon;

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
          // Charger les données associées
          this.loadCompanyRelatedData(company.id);
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

  loadCompanyRelatedData(companyId: string): void {
    this.events$ = this.companyService.loadCompanyEvents(companyId);
    this.articles$ = this.companyService.loadCompanyArticles(companyId);
    this.jobs$ = this.companyService.loadCompanyJobs(companyId);
  }
}
