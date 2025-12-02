import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeRootComponent } from './container/back-office-root/back-office-root.component';
import { ConsultantListComponent } from './components/consultant-list/consultant-list.component';

@NgModule({
  declarations: [
    BackOfficeRootComponent,
    ConsultantListComponent
  ],
  imports: [CommonModule, BackOfficeRoutingModule],
})
export class BackOfficeModule {}
