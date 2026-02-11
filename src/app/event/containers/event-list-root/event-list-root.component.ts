import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event } from 'src/app/shared/models/event.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';
import { SubSink } from 'subsink';
import { EventService } from '../../services/event.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { loadEvents } from '../../store/actions/event.actions';
import { EventState } from '../../store/reducers/event.reducers';
import {
  getEventListCriteria,
  getEventTotalItems,
  getEvents,
  getEventsLoading,
} from '../../store/selectors/event.selectors';
import { EventListCriteria } from '../../types/event-list-criteria.interface';

interface CategoryWithEvents {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  image?: string;
  faq?: { question: string; answer: string }[];
  events: Event[];
  totalEvents: number;
  displayedEventsCount: number; // Nombre d'événements affichés
  showAll: boolean; // Flag pour afficher tous les événements
}

@Component({
  selector: 'app-event-list-root',
  templateUrl: './event-list-root.component.html',
  styleUrls: ['./event-list-root.component.scss'],
})
export class EventListRootComponent implements OnInit, OnDestroy {
  eventsLoading$: Observable<boolean>;
  events$: Observable<Event[]>;
  eventCriteria: EventListCriteria;
  totalItems$: Observable<number>;
  
  // New properties for category-based view
  categoriesWithEvents: CategoryWithEvents[] = [];
  companyEvents: Event[] = [];
  loadingCategories = true;
  loadingCompanyEvents = true;

  subs = new SubSink();

  constructor(
    private eventStore: Store<EventState>,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.events$ = this.eventStore.pipe(select(getEvents));
    this.totalItems$ = this.eventStore.pipe(select(getEventTotalItems));
    this.eventsLoading$ = this.eventStore.select(getEventsLoading);
    
    this.subs.sink = this.eventStore
      .select(getEventListCriteria)
      .subscribe((criteria) => {
        this.eventCriteria = cloneDeep(criteria);
        
        // Vérifier les query params pour la catégorie
        this.subs.sink = this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.eventCriteria.filter = {
              ...this.eventCriteria.filter,
              category: params['category']
            };
            this.eventStore.dispatch(loadEvents(this.eventCriteria));
          }
        });
      });
    
    // Load events by categories
    this.loadEventsByCategories();
    
    // Load company events
    this.loadCompanyEvents();
  }
  
  loadEventsByCategories() {
    this.loadingCategories = true;
    
    // Load all categories and all events in parallel
    forkJoin({
      categories: this.categoryService.getEventCategories(),
      events: this.eventService.loadEvents({
        page: { page: 1, pageSize: 1000 },
        sort: { by: 'date', direction: SortDirection.desc },
        filter: { search: '' }
      })
    }).subscribe({
      next: (result) => {
        // Create a map of events by category ID
        const eventsByCategoryId = new Map<string, Event[]>();
        const eventCountByCategory = new Map<string, number>();
        
        result.events.items.forEach(event => {
          if (event.category) {
            const categoryId = event.category.id;
            
            // Count all events
            eventCountByCategory.set(
              categoryId, 
              (eventCountByCategory.get(categoryId) || 0) + 1
            );
            
            // Store only first 6 events for display
            if (!eventsByCategoryId.has(categoryId)) {
              eventsByCategoryId.set(categoryId, []);
            }
            const categoryEvents = eventsByCategoryId.get(categoryId);
            if (categoryEvents && categoryEvents.length < 6) {
              categoryEvents.push(event);
            }
          }
        });
        
        // Map all categories with their events
        this.categoriesWithEvents = result.categories.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          subtitle: category.subtitle,
          description: category.description,
          image: category.image,
          faq: category.faq,
          events: eventsByCategoryId.get(category.id) || [],
          totalEvents: eventCountByCategory.get(category.id) || 0,
          displayedEventsCount: 3, // Afficher 3 événements par défaut
          showAll: false
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories and events:', error);
        this.categoriesWithEvents = [];
        this.loadingCategories = false;
      }
    });
  }
  
  loadCompanyEvents() {
    this.loadingCompanyEvents = true;
    
    // Load all events and filter those created by companies (not by admin)
    this.eventService.loadEvents({
      page: { page: 1, pageSize: 100 }, // Load more to filter
      sort: { by: 'createdAt', direction: SortDirection.desc },
      filter: { search: '' }
    }).subscribe(result => {
      // Filter to keep only events created by companies (company exists and no admin)
      this.companyEvents = result.items
        .filter(event => event.company && !event.admin)
        .slice(0, 6); // Keep only first 6
      this.loadingCompanyEvents = false;
    });
  }
  
  viewMoreCategory(categorySlug: string) {
    this.router.navigate(['/event/category', categorySlug]);
  }
  
  loadMoreEventsInCategory(categoryId: string) {
    const category = this.categoriesWithEvents.find(c => c.id === categoryId);
    if (category) {
      category.displayedEventsCount = Math.min(
        category.displayedEventsCount + 3,
        category.events.length
      );
    }
  }
  
  showAllEventsInCategory(categoryId: string) {
    const category = this.categoriesWithEvents.find(c => c.id === categoryId);
    if (category) {
      category.displayedEventsCount = category.events.length;
      category.showAll = true;
    }
  }
  
  getDisplayedEvents(category: CategoryWithEvents): Event[] {
    return category.events.slice(0, category.displayedEventsCount);
  }
  
  hasMoreEventsToShow(category: CategoryWithEvents): boolean {
    return category.displayedEventsCount < category.events.length;
  }
  
  onSaveFilter(filter) {
    this.eventCriteria.filter = filter;
    this.eventStore.dispatch(
      loadEvents({
        ...this.eventCriteria,
        page: { ...this.eventCriteria.page, page: 1 },
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  onPaginate(page) {
    this.eventCriteria.page = page;
    this.eventStore.dispatch(loadEvents(this.eventCriteria));
  }
}
