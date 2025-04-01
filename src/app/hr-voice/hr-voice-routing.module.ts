import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrVoiceRootComponent } from './containers/hr-voice-root/hr-voice-root.component';

const routes: Routes = [
  {
    path: '',
    component: HrVoiceRootComponent,
    data: { title: 'Hr Voice' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrVoiceRoutingModule {}
