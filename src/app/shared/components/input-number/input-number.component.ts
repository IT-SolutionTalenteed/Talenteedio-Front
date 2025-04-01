import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent {
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() pageSizeOptions: number[];

  @Output()
  increment: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  decrement: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    /**/
  }

  onIncrement(): void {
    if (this.value < this.max) {
      const index = this.pageSizeOptions.indexOf(this.value);
      if (index !== -1 && index < this.pageSizeOptions.length - 1) {
        this.value = this.pageSizeOptions[index + 1];
        this.increment.emit(this.value);
      }
    }
  }

  onDecrement(): void {
    if (this.value > this.min) {
      const index = this.pageSizeOptions.indexOf(this.value);
      if (index !== -1 && index > 0) {
        this.value = this.pageSizeOptions[index - 1];
        this.decrement.emit(this.value);
      }
    }
  }
}
