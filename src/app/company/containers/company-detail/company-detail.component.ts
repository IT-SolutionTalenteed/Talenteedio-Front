import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, shareReplay, catchError, switchMap } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company.interface';
import { faMapMarkerAlt, faPhone, faEnvelope, faGlobe, faBriefcase, faBuilding, faCalendar, faNewspaper, faBriefcase as faJobIcon } from '@fortawesome/free-solid-svg-icons';
import { CompanyService, PaginatedData } from '../../services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company$: Observable<Company>;
  
  // Pagination pour les jobs
  jobs: any[] = [];
  jobsTotal = 0;
  jobsPage = 1;
  jobsPerPage = 3;
  jobsLoading = false;
  
  // Pagination pour les événements
  events: any[] = [];
  eventsTotal = 0;
  eventsPage = 1;
  eventsPerPage = 3;
  eventsLoading = false;
  
  // Pagination pour les articles
  articles: any[] = [];
  articlesTotal = 0;
  articlesPage = 1;
  articlesPerPage = 3;
  articlesLoading = false;
  
  loading = true;
  error: string = null;
  companySlug: string;
  companyId: string;

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
          this.companyId = company.id;
          // Charger les données associées avec pagination
          this.loadJobs();
          this.loadEvents();
          this.loadArticles();
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

  loadJobs(): void {
    if (!this.companyId) return;
    
    this.jobsLoading = true;
    this.companyService.loadCompanyJobs(this.companyId, this.jobsPage, this.jobsPerPage)
      .subscribe({
        next: (data) => {
          this.jobs = data.items;
          this.jobsTotal = data.total;
          this.jobsLoading = false;
        },
        error: () => {
          this.jobsLoading = false;
        }
      });
  }

  loadEvents(): void {
    if (!this.companyId) return;
    
    this.eventsLoading = true;
    this.companyService.loadCompanyEvents(this.companyId, this.eventsPage, this.eventsPerPage)
      .subscribe({
        next: (data) => {
          this.events = data.items;
          this.eventsTotal = data.total;
          this.eventsLoading = false;
        },
        error: () => {
          this.eventsLoading = false;
        }
      });
  }

  loadArticles(): void {
    if (!this.companyId) return;
    
    this.articlesLoading = true;
    this.companyService.loadCompanyArticles(this.companyId, this.articlesPage, this.articlesPerPage)
      .subscribe({
        next: (data) => {
          this.articles = data.items;
          this.articlesTotal = data.total;
          this.articlesLoading = false;
        },
        error: () => {
          this.articlesLoading = false;
        }
      });
  }

  // Méthodes de pagination pour les jobs
  onJobsPageChange(page: number): void {
    this.jobsPage = page;
    this.loadJobs();
    this.scrollToSection('jobs-section');
  }

  get jobsTotalPages(): number {
    return Math.ceil(this.jobsTotal / this.jobsPerPage);
  }

  get jobsPages(): number[] {
    const totalPages = this.jobsTotalPages;
    const currentPage = this.jobsPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      // Si 7 pages ou moins, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1); // -1 représente les ellipses
      }

      // Pages autour de la page courante
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1); // -1 représente les ellipses
      }

      // Toujours afficher la dernière page
      pages.push(totalPages);
    }

    return pages;
  }

  // Méthodes de pagination pour les événements
  onEventsPageChange(page: number): void {
    this.eventsPage = page;
    this.loadEvents();
    this.scrollToSection('events-section');
  }

  get eventsTotalPages(): number {
    return Math.ceil(this.eventsTotal / this.eventsPerPage);
  }

  get eventsPages(): number[] {
    const totalPages = this.eventsTotalPages;
    const currentPage = this.eventsPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1);
      }

      pages.push(totalPages);
    }

    return pages;
  }

  // Méthodes de pagination pour les articles
  onArticlesPageChange(page: number): void {
    this.articlesPage = page;
    this.loadArticles();
    this.scrollToSection('articles-section');
  }

  get articlesTotalPages(): number {
    return Math.ceil(this.articlesTotal / this.articlesPerPage);
  }

  get articlesPages(): number[] {
    const totalPages = this.articlesTotalPages;
    const currentPage = this.articlesPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1);
      }

      pages.push(totalPages);
    }

    return pages;
  }

  // Utilitaire pour scroller vers une section
  private scrollToSection(sectionId: string): void {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Extraire la description du job (enlever les balises HTML)
  getJobDescription(content: string): string {
    if (!content) return '';
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  }
}
