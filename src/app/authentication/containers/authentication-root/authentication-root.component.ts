import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-authentication-root',
    templateUrl: './authentication-root.component.html',
    styleUrls: ['./authentication-root.component.scss'],
})
export class AuthenticationRootComponent {
    isFullWidth = false;

    constructor(private router: Router) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    this.isFullWidth = event.url.includes('/company-plan');
                }
            });
        
        // Check initial route
        this.isFullWidth = this.router.url.includes('/company-plan');
    }
}
