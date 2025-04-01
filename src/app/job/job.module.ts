import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { JobRootComponent } from './container/job-root/job-root.component';
import { JobRoutingModule } from './job-routing.module';

@NgModule({
  declarations: [JobRootComponent],
  imports: [CommonModule, JobRoutingModule, SharedModule],
})
export class JobModule {}
