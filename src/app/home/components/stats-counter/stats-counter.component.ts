import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-counter',
  templateUrl: './stats-counter.component.html',
  styleUrls: ['./stats-counter.component.scss']
})
export class StatsCounterComponent implements OnInit {
  @Input() targetValue: number = 0;
  @Input() label: string = '';
  @Input() suffix: string = '';
  @Input() icon: string = '';
  
  currentValue: number = 0;
  
  ngOnInit(): void {
    this.animateCounter();
  }
  
  private animateCounter(): void {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = this.targetValue / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      this.currentValue = Math.min(
        Math.floor(increment * currentStep),
        this.targetValue
      );
      
      if (currentStep >= steps) {
        clearInterval(timer);
        this.currentValue = this.targetValue;
      }
    }, stepDuration);
  }
  
  get displayValue(): string {
    return this.currentValue + this.suffix;
  }
}
