import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 0) return 'à venir';

    // Moins d'une minute
    if (seconds < 60) {
      return 'il y a quelques secondes';
    }

    // Moins d'une heure
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? 'il y a 1 minute' : `il y a ${minutes} minutes`;
    }

    // Moins d'un jour
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? 'il y a 1h' : `il y a ${hours}h`;
    }

    // Moins d'un mois (30 jours)
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return days === 1 ? 'il y a 1j' : `il y a ${days}j`;
    }

    // Moins d'un an (365 jours)
    const months = Math.floor(days / 30);
    if (months < 12) {
      return months === 1 ? 'il y a 1 mois' : `il y a ${months} mois`;
    }

    // Plus d'un an - afficher la date complète
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
