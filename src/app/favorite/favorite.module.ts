import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';

import { FavoriteButtonComponent } from './components/favorite-button/favorite-button.component';
import { FavoriteMenuComponent } from './components/favorite-menu/favorite-menu.component';
import { FavoriteListComponent } from './containers/favorite-list/favorite-list.component';
import { FavoriteService } from './services/favorite.service';

const routes: Routes = [
  {
    path: 'favorites',
    component: FavoriteListComponent,
  },
];

@NgModule({
  declarations: [
    FavoriteButtonComponent,
    FavoriteMenuComponent,
    FavoriteListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    SharedModule,
  ],
  exports: [FavoriteButtonComponent, FavoriteMenuComponent],
  providers: [FavoriteService],
})
export class FavoriteModule {}
