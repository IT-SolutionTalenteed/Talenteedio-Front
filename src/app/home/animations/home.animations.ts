import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger
} from '@angular/animations';

export const homeAnimations = {
  // Fade in animation for sections
  fadeIn: trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]),

  // Slide in from left
  slideInLeft: trigger('slideInLeft', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(-50px)' }),
      animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]),

  // Slide in from right
  slideInRight: trigger('slideInRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(50px)' }),
      animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ]),

  // Stagger animation for cards
  staggerCards: trigger('staggerCards', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        stagger('100ms', [
          animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
        ])
      ], { optional: true })
    ])
  ]),

  // Scale up animation
  scaleUp: trigger('scaleUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.8)' }),
      animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ])
  ]),

  // Bounce in animation
  bounceIn: trigger('bounceIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.3)' }),
      animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
        style({ opacity: 1, transform: 'scale(1)' }))
    ])
  ])
};

// Usage example in component:
// import { homeAnimations } from './animations/home.animations';
//
// @Component({
//   selector: 'app-home-root',
//   templateUrl: './home-root.component.html',
//   styleUrls: ['./home-root.component.scss'],
//   animations: [
//     homeAnimations.fadeIn,
//     homeAnimations.slideInLeft,
//     homeAnimations.slideInRight,
//     homeAnimations.staggerCards
//   ]
// })
