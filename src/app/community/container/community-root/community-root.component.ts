import { Component, OnInit, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AuthenticationState } from 'src/app/authentication/store/reducers/authentication.reducers';
import { getUserRole } from 'src/app/authentication/store/selectors/authentication.selectors';
import { Role, RoleName } from 'src/app/shared/models/role.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { CommunityState } from '../../store/reducers/community.reducers';
import {
  getHomeSetting,
  getHomeSettingLoading,
} from '../../store/selectors/community.selectors';

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.scss'],
})
export class CommunityRootComponent implements OnInit {
  readonly communityStore = inject(Store<CommunityState>);
  role$: Observable<Role>;
  isComunityPrivate$: Observable<boolean>;
  homeSetting$: Observable<Partial<Setting>>;
  homeSettingLoading$: Observable<boolean>;

  constructor(private authenticationStore: Store<AuthenticationState>) {}

  ngOnInit(): void {
    this.role$ = this.authenticationStore.pipe(select(getUserRole));
    this.isComunityPrivate$ = this.role$.pipe(
      map(
        (role) =>
          !!(
            role &&
            (role.name === RoleName.ADMIN ||
              role.name === RoleName.HR_FIRST_CLUB)
          )
      )
    );
    this.homeSetting$ = this.communityStore.pipe(select(getHomeSetting));
    this.homeSettingLoading$ = this.communityStore.pipe(
      select(getHomeSettingLoading)
    );
  }
}
