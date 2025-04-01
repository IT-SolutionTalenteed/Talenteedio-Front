import { Component, Input } from '@angular/core';
import { Setting } from 'src/app/shared/models/setting.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  image: string;
  @Input() set homeSetting(value: Partial<Setting>) {
    this.image = value?.homeImage1?.fileUrl ?? '/assets/img/banner-home.jpg';
  }
}
