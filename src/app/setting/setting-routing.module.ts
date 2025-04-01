import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingRootComponent } from './containers/setting-root/setting-root.component';

const routes: Routes = [
    {
      path: '',
      component: SettingRootComponent,
      children: [
        {
          path: '',
          component: SettingRootComponent,
          data: { title: 'Setting' },
        },
      ],
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
