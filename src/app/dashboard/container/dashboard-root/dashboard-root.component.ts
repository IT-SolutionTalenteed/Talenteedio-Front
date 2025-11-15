import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.interface';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { getLoggedUser } from 'src/app/authentication/store/selectors/authentication.selectors';

@Component({
  selector: 'app-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.scss']
})
export class DashboardRootComponent implements OnInit {
  currentUser$: Observable<User>;

  constructor(
    private store: Store,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.store.pipe(select(getLoggedUser));
  }

  onSave(payload: any) {
    // Handle the save logic here
    // You can call a service to update the user and company information
    console.log('Saving profile:', payload);
    
    // Example: Upload logo if provided, then update user/company
    if (payload.logoFile) {
      this.authService.uploadMedia(payload.logoFile, 'image').subscribe((res) => {
        const logoId = res?.data?.result?.id;
        this.updateProfile({ ...payload, logoId });
      });
    } else {
      this.updateProfile(payload);
    }
  }

  private updateProfile(payload: any) {
    // Call your API to update user and company information
    // This is a placeholder - implement according to your API
    console.log('Updating profile with:', payload);
    // Example:
    // this.authService.updateProfile(payload).subscribe(() => {
    //   // Show success message
    // });
  }
}
