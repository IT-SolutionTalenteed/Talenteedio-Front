import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { EventService } from 'src/app/shared/services/event.service';

interface CountdownTime {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-event-countdown-banner',
  templateUrl: './event-countdown-banner.component.html',
  styleUrls: ['./event-countdown-banner.component.scss']
})
export class EventCountdownBannerComponent implements OnInit, OnDestroy {
  featuredEvent: any = null;
  countdown: CountdownTime = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  
  private countdownSubscription: Subscription;
  private eventSubscription: Subscription;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadFeaturedEvent();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  loadFeaturedEvent(): void {
    this.eventSubscription = this.eventService.getFeaturedEvent().subscribe({
      next: (event) => {
        if (event) {
          this.featuredEvent = event;
          this.startCountdown();
        }
      },
      error: (error) => {
        console.error('Error loading featured event:', error);
      }
    });
  }

  startCountdown(): void {
    if (!this.featuredEvent) return;

    // Calculer immédiatement
    this.updateCountdown();

    // Mettre à jour chaque seconde
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  updateCountdown(): void {
    if (!this.featuredEvent) return;

    const eventDate = new Date(this.featuredEvent.date);
    
    // Ajouter l'heure de début si disponible
    if (this.featuredEvent.startTime) {
      const [hours, minutes] = this.featuredEvent.startTime.split(':');
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      // L'événement est passé
      this.countdown = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      return;
    }

    // Calculer les différences
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Calculer les années et mois approximatifs
    const years = Math.floor(days / 365);
    const remainingDaysAfterYears = days % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);
    const remainingDays = remainingDaysAfterYears % 30;

    this.countdown = {
      years: years,
      months: months,
      days: remainingDays,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60
    };
  }
}
