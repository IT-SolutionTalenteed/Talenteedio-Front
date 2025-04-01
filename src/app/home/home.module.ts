import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BlogService } from '../blog/services/blog.service';
import { JobListService } from '../job-list/services/job-list.service';
import { SharedModule } from '../shared/shared.module';
import { BannerComponent } from './components/banner/banner.component';
import { FeaturedJobComponent } from './components/featured-job/featured-job.component';
import { JobItemComponent } from './components/featured-job/job-item/job-item.component';
import { HrMediaComponent } from './components/hr-media/hr-media.component';
import { InterviewComponent } from './components/hr-media/interview/interview.component';
import { NewItemComponent } from './components/hr-media/new-item/new-item.component';
import { NewsComponent } from './components/hr-media/news/news.component';
import { CardArticleComponent } from './components/new-article/card-article/card-article.component';
import { NewArticleComponent } from './components/new-article/new-article.component';
import { CardCustomerComponent } from './components/our-customer/card-customer/card-customer.component';
import { OurCustomerComponent } from './components/our-customer/our-customer.component';
import { PartnersComponent } from './components/partners/partners.component';
import { RecentArticleComponent } from './components/recent-article/recent-article.component';
import { HomeRootComponent } from './containers/home-root/home-root.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './services/home.service';
import { HomeRouterEffects } from './store/effects/home-router.effects';
import { HomeEffects } from './store/effects/home.effects';
import { homeReducer } from './store/reducers/home.reducers';

@NgModule({
  declarations: [
    HomeRootComponent,
    FeaturedJobComponent,
    RecentArticleComponent,
    BannerComponent,
    JobItemComponent,
    NewsComponent,
    NewItemComponent,
    InterviewComponent,
    NewArticleComponent,
    CardArticleComponent,
    OurCustomerComponent,
    CardCustomerComponent,
    HrMediaComponent,
    PartnersComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule,
    StoreModule.forFeature('home', homeReducer),
    EffectsModule.forFeature([HomeEffects, HomeRouterEffects]),
    CarouselModule,
  ],
  providers: [
    {
      provide: HomeService,
      useClass: HomeService,
    },
    BlogService,
    JobListService,
  ],
})
export class HomeModule {}
