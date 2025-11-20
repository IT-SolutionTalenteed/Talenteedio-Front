import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Nettoyer les données de session
    sessionStorage.removeItem('coachingContactData');
    sessionStorage.removeItem('coachingBookingData');
  }
}
