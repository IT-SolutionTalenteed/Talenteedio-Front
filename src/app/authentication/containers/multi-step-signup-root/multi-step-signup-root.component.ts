import { Component } from '@angular/core';

@Component({
  selector: 'app-multi-step-signup-root',
  template: '<app-multi-step-signup></app-multi-step-signup>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class MultiStepSignupRootComponent {}
