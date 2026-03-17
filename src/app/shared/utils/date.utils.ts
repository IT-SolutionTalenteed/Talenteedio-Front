/**
 * Utilitaires pour la gestion des dates
 * Évite les problèmes de fuseau horaire en utilisant les dates locales
 */
export class DateUtils {
  /**
   * Formate une date en string YYYY-MM-DD en utilisant la date locale
   * Évite les problèmes de fuseau horaire contrairement à toISOString()
   */
  static formatDateToString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Obtient la date d'aujourd'hui au format YYYY-MM-DD
   */
  static getTodayString(): string {
    return this.formatDateToString(new Date());
  }

  /**
   * Compare deux dates au format string YYYY-MM-DD
   */
  static compareDateStrings(date1: string, date2: string): number {
    return date1.localeCompare(date2);
  }

  /**
   * Vérifie si une date string est aujourd'hui
   */
  static isToday(dateString: string): boolean {
    return dateString === this.getTodayString();
  }

  /**
   * Vérifie si une date string est dans le passé
   */
  static isPastDate(dateString: string): boolean {
    return dateString < this.getTodayString();
  }

  /**
   * Vérifie si une date string est dans le futur
   */
  static isFutureDate(dateString: string): boolean {
    return dateString > this.getTodayString();
  }
}