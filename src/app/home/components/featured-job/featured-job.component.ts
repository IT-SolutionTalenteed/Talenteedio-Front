import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Job } from 'src/app/shared/models/job.interface';
import { Setting } from 'src/app/shared/models/setting.interface';
import { CAROUSEL_OPTIONS } from '../../constants/home.constant';
@Component({
  selector: 'app-featured-job',
  templateUrl: './featured-job.component.html',
  styleUrls: ['./featured-job.component.scss'],
})
export class FeaturedJobComponent implements OnInit, OnChanges {
  @Input() jobs: Job[];
  @Input() homeSettingLoading: boolean;
  @Input() jobsLoading: boolean;
  private sanitizer = inject(DomSanitizer);
  content: SafeHtml;
  image: string;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(value?.gateway ?? '');
    this.image = value?.homeImage2?.fileUrl ?? '/assets/img/jobs-banner.jpg';
  }
  active = 'left';
  currentIndex = 3;
  carouselOptions: OwlOptions;
  ssrtype = false;
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.ssrtype = true;
    }
  }

  ngOnChanges(): void {
    const owlOptions = CAROUSEL_OPTIONS;
    if (this.jobs.length <= 3) {
      owlOptions.loop = false;
      owlOptions.autoWidth = true;
    } else {
      owlOptions.loop = true;
      owlOptions.autoWidth = false;
    }
    this.carouselOptions = owlOptions;
  }
}
