import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatsCounterComponent } from './stats-counter.component';

describe('StatsCounterComponent', () => {
  let component: StatsCounterComponent;
  let fixture: ComponentFixture<StatsCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsCounterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with currentValue as 0', () => {
    expect(component.currentValue).toBe(0);
  });

  it('should accept targetValue input', () => {
    component.targetValue = 1000;
    expect(component.targetValue).toBe(1000);
  });

  it('should accept label input', () => {
    component.label = 'Test Label';
    expect(component.label).toBe('Test Label');
  });

  it('should accept suffix input', () => {
    component.suffix = 'k+';
    expect(component.suffix).toBe('k+');
  });

  it('should accept icon input', () => {
    const testIcon = '<svg></svg>';
    component.icon = testIcon;
    expect(component.icon).toBe(testIcon);
  });

  it('should animate counter on init', fakeAsync(() => {
    component.targetValue = 100;
    component.ngOnInit();
    
    expect(component.currentValue).toBe(0);
    
    tick(1000); // Wait 1 second
    expect(component.currentValue).toBeGreaterThan(0);
    
    tick(2000); // Wait full duration
    expect(component.currentValue).toBe(100);
  }));

  it('should display value with suffix', () => {
    component.currentValue = 20;
    component.suffix = 'k+';
    expect(component.displayValue).toBe('20k+');
  });

  it('should display value without suffix when suffix is empty', () => {
    component.currentValue = 260;
    component.suffix = '';
    expect(component.displayValue).toBe('260');
  });

  it('should not exceed target value during animation', fakeAsync(() => {
    component.targetValue = 50;
    component.ngOnInit();
    
    tick(3000); // Wait longer than animation duration
    
    expect(component.currentValue).toBe(50);
    expect(component.currentValue).not.toBeGreaterThan(50);
  }));

  it('should render stat item with correct structure', () => {
    component.targetValue = 100;
    component.label = 'Test Stat';
    component.suffix = '+';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const statItem = compiled.querySelector('.stat-item');
    const statIcon = compiled.querySelector('.stat-icon');
    const statNumber = compiled.querySelector('.stat-number');
    const statLabel = compiled.querySelector('.stat-label');
    
    expect(statItem).toBeTruthy();
    expect(statIcon).toBeTruthy();
    expect(statNumber).toBeTruthy();
    expect(statLabel).toBeTruthy();
    expect(statLabel.textContent).toContain('Test Stat');
  });

  it('should handle large numbers correctly', fakeAsync(() => {
    component.targetValue = 20000;
    component.ngOnInit();
    
    tick(2000);
    
    expect(component.currentValue).toBe(20000);
  }));

  it('should handle zero as target value', fakeAsync(() => {
    component.targetValue = 0;
    component.ngOnInit();
    
    tick(2000);
    
    expect(component.currentValue).toBe(0);
  }));
});
