import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerRootComponent } from './pages/employer-root/employer-root.component';
import { EmployerPricingComponent } from './pages/employer-pricing/employer-pricing.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerRootComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'jobs', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
  {
    path: 'pricing',
    component: EmployerPricingComponent,
    data: { title: 'Gérer mon abonnement - Talenteedio' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployerRoutingModule {}

