import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company.interface';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  private companiesSubject = new BehaviorSubject<Company[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  
  companies$ = this.companiesSubject.asObservable();
  filteredCompanies$: Observable<Company[]>;
  loading = true;
  searchTerm = '';

  constructor(private companyService: CompanyService) {
    this.filteredCompanies$ = combineLatest([
      this.companies$,
      this.searchTermSubject
    ]).pipe(
      map(([companies, searchTerm]) => {
        if (!searchTerm) {
          return companies;
        }
        return companies.filter(company =>
          company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.loadCompanies().subscribe({
      next: (companies) => {
        this.companiesSubject.next(companies);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.companiesSubject.next([]);
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchTermSubject.next(target.value);
  }
}
