import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDetailRootComponent } from './containers/blog-detail-root/blog-detail-root.component';
import { BlogListRootComponent } from './containers/blog-list-root/blog-list-root.component';
import { BlogRootComponent } from './containers/blog-root/blog-root.component';

const routes: Routes = [
  {
    path: '',
    component: BlogRootComponent,
    data: { title: 'News' },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: BlogListRootComponent,
        data: { title: 'News' },
      },
      {
        path: 'detail/:articleId',
        component: BlogDetailRootComponent,
        data: { title: 'News' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
