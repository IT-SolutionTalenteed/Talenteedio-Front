export interface Timezone {
  value: string;
  label: string;
  offset: string;
}

export const TIMEZONES: Timezone[] = [
  // Afrique
  { value: 'Africa/Abidjan', label: 'Abidjan', offset: 'UTC+00:00' },
  { value: 'Africa/Accra', label: 'Accra', offset: 'UTC+00:00' },
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa', offset: 'UTC+03:00' },
  { value: 'Africa/Algiers', label: 'Alger', offset: 'UTC+01:00' },
  { value: 'Africa/Cairo', label: 'Le Caire', offset: 'UTC+02:00' },
  { value: 'Africa/Casablanca', label: 'Casablanca', offset: 'UTC+01:00' },
  { value: 'Africa/Dakar', label: 'Dakar', offset: 'UTC+00:00' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg', offset: 'UTC+02:00' },
  { value: 'Africa/Lagos', label: 'Lagos', offset: 'UTC+01:00' },
  { value: 'Africa/Nairobi', label: 'Nairobi', offset: 'UTC+03:00' },
  { value: 'Africa/Tunis', label: 'Tunis', offset: 'UTC+01:00' },
  
  // Amérique du Nord
  { value: 'America/Anchorage', label: 'Anchorage', offset: 'UTC-09:00' },
  { value: 'America/Chicago', label: 'Chicago', offset: 'UTC-06:00' },
  { value: 'America/Denver', label: 'Denver', offset: 'UTC-07:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles', offset: 'UTC-08:00' },
  { value: 'America/Mexico_City', label: 'Mexico', offset: 'UTC-06:00' },
  { value: 'America/New_York', label: 'New York', offset: 'UTC-05:00' },
  { value: 'America/Phoenix', label: 'Phoenix', offset: 'UTC-07:00' },
  { value: 'America/Toronto', label: 'Toronto', offset: 'UTC-05:00' },
  { value: 'America/Vancouver', label: 'Vancouver', offset: 'UTC-08:00' },
  
  // Amérique du Sud
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires', offset: 'UTC-03:00' },
  { value: 'America/Bogota', label: 'Bogota', offset: 'UTC-05:00' },
  { value: 'America/Caracas', label: 'Caracas', offset: 'UTC-04:00' },
  { value: 'America/Lima', label: 'Lima', offset: 'UTC-05:00' },
  { value: 'America/Santiago', label: 'Santiago', offset: 'UTC-03:00' },
  { value: 'America/Sao_Paulo', label: 'São Paulo', offset: 'UTC-03:00' },
  
  // Asie
  { value: 'Asia/Baghdad', label: 'Baghdad', offset: 'UTC+03:00' },
  { value: 'Asia/Bangkok', label: 'Bangkok', offset: 'UTC+07:00' },
  { value: 'Asia/Beirut', label: 'Beyrouth', offset: 'UTC+02:00' },
  { value: 'Asia/Colombo', label: 'Colombo', offset: 'UTC+05:30' },
  { value: 'Asia/Damascus', label: 'Damas', offset: 'UTC+02:00' },
  { value: 'Asia/Dhaka', label: 'Dhaka', offset: 'UTC+06:00' },
  { value: 'Asia/Dubai', label: 'Dubaï', offset: 'UTC+04:00' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+08:00' },
  { value: 'Asia/Jakarta', label: 'Jakarta', offset: 'UTC+07:00' },
  { value: 'Asia/Jerusalem', label: 'Jérusalem', offset: 'UTC+02:00' },
  { value: 'Asia/Karachi', label: 'Karachi', offset: 'UTC+05:00' },
  { value: 'Asia/Kathmandu', label: 'Katmandou', offset: 'UTC+05:45' },
  { value: 'Asia/Kolkata', label: 'Kolkata', offset: 'UTC+05:30' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur', offset: 'UTC+08:00' },
  { value: 'Asia/Kuwait', label: 'Koweït', offset: 'UTC+03:00' },
  { value: 'Asia/Manila', label: 'Manille', offset: 'UTC+08:00' },
  { value: 'Asia/Riyadh', label: 'Riyad', offset: 'UTC+03:00' },
  { value: 'Asia/Seoul', label: 'Séoul', offset: 'UTC+09:00' },
  { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'UTC+08:00' },
  { value: 'Asia/Singapore', label: 'Singapour', offset: 'UTC+08:00' },
  { value: 'Asia/Taipei', label: 'Taipei', offset: 'UTC+08:00' },
  { value: 'Asia/Tehran', label: 'Téhéran', offset: 'UTC+03:30' },
  { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+09:00' },
  
  // Atlantique
  { value: 'Atlantic/Azores', label: 'Açores', offset: 'UTC-01:00' },
  { value: 'Atlantic/Cape_Verde', label: 'Cap-Vert', offset: 'UTC-01:00' },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik', offset: 'UTC+00:00' },
  
  // Australie
  { value: 'Australia/Adelaide', label: 'Adélaïde', offset: 'UTC+09:30' },
  { value: 'Australia/Brisbane', label: 'Brisbane', offset: 'UTC+10:00' },
  { value: 'Australia/Darwin', label: 'Darwin', offset: 'UTC+09:30' },
  { value: 'Australia/Melbourne', label: 'Melbourne', offset: 'UTC+10:00' },
  { value: 'Australia/Perth', label: 'Perth', offset: 'UTC+08:00' },
  { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+10:00' },
  
  // Europe
  { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: 'UTC+01:00' },
  { value: 'Europe/Athens', label: 'Athènes', offset: 'UTC+02:00' },
  { value: 'Europe/Belgrade', label: 'Belgrade', offset: 'UTC+01:00' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+01:00' },
  { value: 'Europe/Brussels', label: 'Bruxelles', offset: 'UTC+01:00' },
  { value: 'Europe/Bucharest', label: 'Bucarest', offset: 'UTC+02:00' },
  { value: 'Europe/Budapest', label: 'Budapest', offset: 'UTC+01:00' },
  { value: 'Europe/Copenhagen', label: 'Copenhague', offset: 'UTC+01:00' },
  { value: 'Europe/Dublin', label: 'Dublin', offset: 'UTC+00:00' },
  { value: 'Europe/Helsinki', label: 'Helsinki', offset: 'UTC+02:00' },
  { value: 'Europe/Istanbul', label: 'Istanbul', offset: 'UTC+03:00' },
  { value: 'Europe/Lisbon', label: 'Lisbonne', offset: 'UTC+00:00' },
  { value: 'Europe/London', label: 'Londres', offset: 'UTC+00:00' },
  { value: 'Europe/Madrid', label: 'Madrid', offset: 'UTC+01:00' },
  { value: 'Europe/Moscow', label: 'Moscou', offset: 'UTC+03:00' },
  { value: 'Europe/Oslo', label: 'Oslo', offset: 'UTC+01:00' },
  { value: 'Europe/Paris', label: 'Paris', offset: 'UTC+01:00' },
  { value: 'Europe/Prague', label: 'Prague', offset: 'UTC+01:00' },
  { value: 'Europe/Rome', label: 'Rome', offset: 'UTC+01:00' },
  { value: 'Europe/Stockholm', label: 'Stockholm', offset: 'UTC+01:00' },
  { value: 'Europe/Vienna', label: 'Vienne', offset: 'UTC+01:00' },
  { value: 'Europe/Warsaw', label: 'Varsovie', offset: 'UTC+01:00' },
  { value: 'Europe/Zurich', label: 'Zurich', offset: 'UTC+01:00' },
  
  // Pacifique
  { value: 'Pacific/Auckland', label: 'Auckland', offset: 'UTC+12:00' },
  { value: 'Pacific/Fiji', label: 'Fidji', offset: 'UTC+12:00' },
  { value: 'Pacific/Guam', label: 'Guam', offset: 'UTC+10:00' },
  { value: 'Pacific/Honolulu', label: 'Honolulu', offset: 'UTC-10:00' },
  { value: 'Pacific/Pago_Pago', label: 'Pago Pago', offset: 'UTC-11:00' },
  { value: 'Pacific/Tahiti', label: 'Tahiti', offset: 'UTC-10:00' },
  
  // Caraïbes
  { value: 'America/Havana', label: 'La Havane', offset: 'UTC-05:00' },
  { value: 'America/Jamaica', label: 'Jamaïque', offset: 'UTC-05:00' },
  { value: 'America/Port-au-Prince', label: 'Port-au-Prince', offset: 'UTC-05:00' },
  { value: 'America/Santo_Domingo', label: 'Saint-Domingue', offset: 'UTC-04:00' },
];
