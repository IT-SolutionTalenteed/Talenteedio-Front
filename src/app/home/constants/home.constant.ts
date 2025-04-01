import { OwlOptions } from 'ngx-owl-carousel-o';
import { BLOG_DEFAULT_CRITERIA } from 'src/app/blog/constants/blog.constant';
import { ArticleListCriteria } from 'src/app/blog/types/article-list-criteria.interface';
import { JOB_LIST_DEFAULT_CRITERIA } from 'src/app/job-list/constants/job-list.constant';
import { JobListCriteria } from 'src/app/job-list/types/job-list-criteria.interface';
import { SortDirection } from 'src/app/shared/types/sort.interface';

export const HOME_ROUTE = '/home';
export const CAROUSEL_OPTIONS: OwlOptions = {
  //   loop: true,
  pullDrag: true,
  mouseDrag: true,
  freeDrag: true,
  touchDrag: true,
  autoplay: true,
  autoplaySpeed: 500,
  autoplayTimeout: 9000,
  // center: true,
  dots: false,
  dotsEach: false,
  //   autoHeight: true,
  autoWidth: false,
  navSpeed: 800,
  dotsSpeed: 500,
  stagePadding: 20,
  margin: 30,
  items: 2,
  responsive: {
    0: {
      items: 1,
      autoWidth: false,
    },
    400: {
      items: 1,
      autoWidth: false,
    },
    600: {
      items: 2,
      autoWidth: false,
    },
    1100: {
      items: 3,
    },
  },
};

export const TESTIMONIALS_CAROUSEL_OPTIONS: OwlOptions = {
  loop: true,
  pullDrag: false,
  mouseDrag: true,
  freeDrag: true,
  touchDrag: false,
  autoplay: false,
  autoplaySpeed: 500,
  autoplayTimeout: 9000,
  center: true,
  dots: true,
  margin: 25,
  autoHeight: false,
  autoWidth: false,
  navSpeed: 800,
  dotsSpeed: 500,
  items: 1,
  responsive: {
    0: {
      items: 1,
    },
    400: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
};

export const HOME_ARTICLE_CRITERIA: ArticleListCriteria = {
  ...BLOG_DEFAULT_CRITERIA,
  sort: { by: 'createdAt', direction: SortDirection.asc },
  page: { ...BLOG_DEFAULT_CRITERIA.page, pageSize: 1 },
  filter: { category: 'interview' },
};

export const HOME_JOB_CRITERIA: JobListCriteria = {
  ...JOB_LIST_DEFAULT_CRITERIA,
  page: { ...JOB_LIST_DEFAULT_CRITERIA.page, pageSize: 6 },
};
