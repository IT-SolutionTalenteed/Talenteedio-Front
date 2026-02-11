import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Event } from 'src/app/shared/models/event.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';
import { Page } from 'src/app/shared/types/page.interface';
import { EventService } from '../../services/event.service';
import { CategoryService, Category } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-event-category-detail',
  templateUrl: './event-category-detail.component.html',
  styleUrls: ['./event-category-detail.component.scss']
})
export class EventCategoryDetailComponent implements OnInit, OnDestroy {
  category: Category | null = null;
  events: Event[] = [];
  loading = true;
  eventsLoading = true;
  currentPage = 1;
  pageSize = 12;
  totalEvents = 0;
  safeVideoUrl: SafeResourceUrl | null = null;
  currentGalleryIndex = 0;
  
  subs = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private eventService: EventService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subs.sink = this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadCategoryBySlug(slug);
      }
    });
  }

  loadCategoryBySlug(slug: string) {
    this.loading = true;
    
    // Load category
    this.subs.sink = this.categoryService.getEventCategories().subscribe({
      next: (categories) => {
        this.category = categories.find(c => c.slug === slug) || null;
        this.loading = false;
        
        if (this.category) {
          // Sanitize video URL if exists
          if (this.category.video) {
            this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.category.video);
          }
          this.loadEvents();
        }
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.loading = false;
      }
    });
  }

  loadEvents() {
    if (!this.category) return;
    
    this.eventsLoading = true;
    
    console.log('Loading events for category:', this.category.id, this.category.slug);
    
    this.subs.sink = this.eventService.loadEvents({
      page: { page: this.currentPage, pageSize: this.pageSize },
      sort: { by: 'date', direction: SortDirection.desc },
      filter: { 
        search: '',
        category: this.category.slug
      }
    }).subscribe({
      next: (result) => {
        console.log('Events loaded:', result);
        this.events = result.items;
        this.totalEvents = result.totalItems;
        this.eventsLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.eventsLoading = false;
      }
    });
  }

  onPageChange(page: Page) {
    this.currentPage = page.page;
    this.pageSize = page.pageSize;
    this.loadEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isVideoUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  }

  nextGalleryImage() {
    if (this.category?.gallery && this.category.gallery.length > 0) {
      this.currentGalleryIndex = (this.currentGalleryIndex + 1) % this.category.gallery.length;
    }
  }

  prevGalleryImage() {
    if (this.category?.gallery && this.category.gallery.length > 0) {
      this.currentGalleryIndex = this.currentGalleryIndex === 0 
        ? this.category.gallery.length - 1 
        : this.currentGalleryIndex - 1;
    }
  }

  goToGalleryImage(index: number) {
    this.currentGalleryIndex = index;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
