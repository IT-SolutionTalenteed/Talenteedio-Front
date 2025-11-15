import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerRootComponent } from './pages/employer-root/employer-root.component';

const routes: Routes = [
  {
    path: '',
    component: EmployerRootComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'jobs', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployerRoutingModule {}

