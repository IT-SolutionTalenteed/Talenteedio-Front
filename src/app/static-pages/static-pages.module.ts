import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { StaticPagesComponent } from './static-pages.component';

const routes: Routes = [
  {
    path: 'corporate',
    component: StaticPagesComponent,
    data: { page: 'corporate' }
  },
  {
    path: 'company',
    component: StaticPagesComponent,
    data: { page: 'company' }
  },
  {
    path: 'entreprise',
    component: StaticPagesComponent,
    data: { page: 'entreprises' }
  },
  {
    path: 'comment',
    component: StaticPagesComponent,
    data: { page: 'comment' }
  },
  {
    path: 'matching',
    component: StaticPagesComponent,
    data: { page: 'matching' }
  },
  {
    path: 'talent',
    component: StaticPagesComponent,
    data: { page: 'talent' }
  }
];

@NgModule({
  declarations: [StaticPagesComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class StaticPagesModule {}
