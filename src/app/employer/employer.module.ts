import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployerRoutingModule } from './employer-routing.module';
import { EmployerRootComponent } from './pages/employer-root/employer-root.component';
import { EmployerJobsComponent } from './pages/employer-jobs/employer-jobs.component';
import { EmployerService } from './services/employer.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, EmployerRoutingModule],
  declarations: [EmployerRootComponent, EmployerJobsComponent],
  providers: [EmployerService],
})
export class EmployerModule {}

