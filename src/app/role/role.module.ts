import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RoleService } from './services/role.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [RoleService],
})
export class RoleModule {}
