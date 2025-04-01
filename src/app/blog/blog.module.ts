import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogItemComponent } from './components/blog-item/blog-item.component';
import { BlogListBoxFilterComponent } from './components/blog-list-box-filter/blog-list-box-filter.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { DetailDraftComponent } from './components/detail-draft/detail-draft.component';
import { TableDraftComponent } from './components/table-draft/table-draft.component';
import { BlogDetailRootComponent } from './containers/blog-detail-root/blog-detail-root.component';
import { BlogListRootComponent } from './containers/blog-list-root/blog-list-root.component';
import { BlogRootComponent } from './containers/blog-root/blog-root.component';
import { MasterDetailDraftComponent } from './containers/master-detail-draft/master-detail-draft.component';
import { BlogService } from './services/blog.service';
import { BlogRouterEffects } from './store/effects/blog-router.effects';
import { BlogEffects } from './store/effects/blog.effects';
import { blogReducer } from './store/reducers/blog.reducers';

@NgModule({
  declarations: [
    TableDraftComponent,
    DetailDraftComponent,
    MasterDetailDraftComponent,
    BlogRootComponent,
    BlogListRootComponent,
    BlogDetailRootComponent,
    BlogListBoxFilterComponent,
    BlogListComponent,
    BlogItemComponent,
    BlogDetailComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    StoreModule.forFeature('blog', blogReducer),
    EffectsModule.forFeature([BlogEffects, BlogRouterEffects]),
  ],
  providers: [BlogService],
  exports: [BlogItemComponent],
})
export class BlogModule {}
