import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event } from 'src/app/shared/models/event.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';
import { SubSink } from 'subsink';
import { EventService } from '../../services/event.service';
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
  events: Event[];
  totalEvents: number;
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
    private eventService: EventService
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
    
    // Load all public events to extract categories
    this.eventService.loadEvents({
      page: { page: 1, pageSize: 100 }, // Load more events to get all categories
      sort: { by: 'date', direction: SortDirection.desc },
      filter: { search: '' }
    }).subscribe(result => {
      // Extract unique categories from events
      const categoryMap = new Map<string, CategoryWithEvents>();
      
      result.items.forEach(event => {
        if (event.category) {
          const categoryId = event.category.id;
          
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              id: event.category.id,
              name: event.category.name,
              slug: event.category.slug,
              events: [],
              totalEvents: 0
            });
          }
          
          const category = categoryMap.get(categoryId);
          if (category && category.events.length < 6) {
            category.events.push(event);
          }
          if (category) {
            category.totalEvents++;
          }
        }
      });
      
      // Convert map to array and filter categories with events
      this.categoriesWithEvents = Array.from(categoryMap.values())
        .filter(cat => cat.events.length > 0);
      
      this.loadingCategories = false;
    }, error => {
      console.error('Error loading events by categories:', error);
      this.categoriesWithEvents = [];
      this.loadingCategories = false;
    });
  }
  
  loadCompanyEvents() {
    this.loadingCompanyEvents = true;
    
    // Load events from companies sorted by creation date
    // These are events that may not have a specific category or are company-specific
    this.eventService.loadEvents({
      page: { page: 1, pageSize: 6 },
      sort: { by: 'createdAt', direction: SortDirection.desc },
      filter: { search: '' }
    }).subscribe(result => {
      this.companyEvents = result.items;
      this.loadingCompanyEvents = false;
    });
  }
  
  viewMoreCategory(categoryId: string) {
    this.router.navigate(['/event/list'], { 
      queryParams: { category: categoryId } 
    });
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
