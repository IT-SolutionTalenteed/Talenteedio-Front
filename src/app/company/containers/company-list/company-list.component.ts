import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from 'src/app/shared/models/company.interface';
import { CompanyService } from '../../services/company.service';
import { Category } from 'src/app/shared/models/job.interface';

interface TabFilter {
  id: string;
  label: string;
  categoryId?: string;
}

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, AfterViewInit {
  @ViewChild('tabsWrapper') tabsWrapper: ElementRef<HTMLDivElement>;

  private companiesSubject = new BehaviorSubject<Company[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private activeTabSubject = new BehaviorSubject<string>('all');
  
  companies$ = this.companiesSubject.asObservable();
  filteredCompanies$: Observable<Company[]>;
  loading = true;
  searchTerm = '';
  activeTab = 'all';
  tabs: TabFilter[] = [];
  showScrollButtons = false;

  constructor(private companyService: CompanyService) {
    this.filteredCompanies$ = combineLatest([
      this.companies$,
      this.searchTermSubject,
      this.activeTabSubject
    ]).pipe(
      map(([companies, searchTerm, activeTab]) => {
        let filtered = companies;

        // Filter by tab/category
        if (activeTab !== 'all') {
          filtered = filtered.filter(company => 
            company.category?.id === activeTab
          );
        }

        // Filter by search term
        if (searchTerm) {
          filtered = filtered.filter(company =>
            company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return filtered;
      })
    );
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngAfterViewInit(): void {
    this.checkScrollButtons();
    window.addEventListener('resize', () => this.checkScrollButtons());
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.loadCompanies().subscribe({
      next: (companies) => {
        this.companiesSubject.next(companies);
        this.buildTabs(companies);
        this.loading = false;
        setTimeout(() => this.checkScrollButtons(), 100);
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.companiesSubject.next([]);
        this.loading = false;
      }
    });
  }

  buildTabs(companies: Company[]): void {
    // Extraire les catégories uniques
    const categoriesMap = new Map<string, Category>();
    
    companies.forEach(company => {
      if (company.category && company.category.id) {
        categoriesMap.set(company.category.id, company.category);
      }
    });

    // Créer les onglets
    this.tabs = [
      { id: 'all', label: 'Toutes' }
    ];

    // Ajouter les catégories triées par nom
    const sortedCategories = Array.from(categoriesMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));

    sortedCategories.forEach(category => {
      this.tabs.push({
        id: category.id,
        label: category.name,
        categoryId: category.id
      });
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchTermSubject.next(target.value);
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    this.activeTabSubject.next(tabId);
  }

  getCompanyCount(tabId: string): number {
    const companies = this.companiesSubject.value;
    if (tabId === 'all') return companies.length;

    return companies.filter(company => 
      company.category?.id === tabId
    ).length;
  }

  scrollTabs(direction: 'left' | 'right'): void {
    if (!this.tabsWrapper) return;
    
    const scrollAmount = 300;
    const wrapper = this.tabsWrapper.nativeElement;
    
    if (direction === 'left') {
      wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  checkScrollButtons(): void {
    if (!this.tabsWrapper) return;
    
    const wrapper = this.tabsWrapper.nativeElement;
    this.showScrollButtons = wrapper.scrollWidth > wrapper.clientWidth;
  }
}
