import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { AuthenticationEffects } from '../authentication/store/effects/authentication.effects';
import { SharedModule } from '../shared/shared.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RootComponent } from './components/root/root.component';
import { MenuItemComponent } from './components/side-nav/menu-item/menu-item.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SupportBannerComponent } from './components/support-banner/support-banner.component';
import { RolesGuard } from './guards/roles.guard';
import { VerifyService } from './guards/verify.guard';
import { RootRoutingModule } from './root-routing.module';
/**
 * Module which regroups component which is the entry point of features
 * that cannot be accessed without authentification, and all single use
 * components whose instance will be shared throughout those features
 * (header, sidenav, ...)
 */
@NgModule({
  imports: [
    CommonModule,
    RootRoutingModule,
    EffectsModule.forFeature([AuthenticationEffects]),
    FontAwesomeModule,
    SharedModule,
    FavoriteModule,
  ],
  declarations: [
    RootComponent,
    HeaderComponent,
    SideNavComponent,
    MenuItemComponent,
    FooterComponent,
    SupportBannerComponent,
  ],
  providers: [
    RolesGuard,
    {
      provide: AuthenticationService,
      useClass: AuthenticationService,
    },
    VerifyService,
  ],
})
export class RootModule {}
