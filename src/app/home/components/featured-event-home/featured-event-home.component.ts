import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface CountdownTime {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-featured-event-home',
  templateUrl: './featured-event-home.component.html',
  styleUrls: ['./featured-event-home.component.scss']
})
export class FeaturedEventHomeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() upcomingEvents: any[] = [];
  @Input() loading: boolean = false;

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

  ngOnInit(): void {
    this.findFeaturedEvent();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  ngOnChanges(): void {
    this.findFeaturedEvent();
  }

  findFeaturedEvent(): void {
    if (this.upcomingEvents && this.upcomingEvents.length > 0) {
      // Chercher l'événement featured ou prendre le premier
      this.featuredEvent = this.upcomingEvents.find(event => event.featured) || this.upcomingEvents[0];
      
      if (this.featuredEvent) {
        this.startCountdown();
      }
    } else {
      this.featuredEvent = null;
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    }
  }

  startCountdown(): void {
    if (!this.featuredEvent) return;

    // Calculer immédiatement
    this.updateCountdown();

    // Arrêter le countdown précédent s'il existe
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

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

    // Calculer les différentes unités de temps
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.countdown = {
      years,
      months,
      days,
      hours,
      minutes,
      seconds
    };
  }
}