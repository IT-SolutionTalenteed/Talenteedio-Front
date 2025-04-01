import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('width') spinnerWidth = 50;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('height') spinnerHeight = 50;
  @Input() isLoading = true;
  @Input() fullWidth = false;
  @Input() message: string;
  @Input() heightAuto = false;
}
