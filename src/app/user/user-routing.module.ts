import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from '../root/guards/roles.guard';
import { RoleName } from '../shared/models/role.interface';
import { UserFormRootComponent } from './containers/user-form-root/user-form-root.component';
import { UserRootComponent } from './containers/user-root/user-root.component';

const routes: Routes = [
  {
    path: '',
    component: UserRootComponent,
    canActivate: [RolesGuard],
    data: { roles: [RoleName.ADMIN], title: 'Liste utilisateurs' },
    children: [
      {
        path: 'detail/:userId',
        component: UserFormRootComponent,
        data: { title: 'Detail utilisateur' },
      },
      {
        path: 'edit/:userId',
        component: UserFormRootComponent,
        data: { title: 'Edition utilisateur' },
      },
      {
        path: 'new',
        component: UserFormRootComponent,
        data: { title: 'Création utilisateur' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
