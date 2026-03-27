import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTooltipComponent } from './annotation-tooltip.component';

describe('AnnotationTooltipComponent', () => {
  let component: AnnotationTooltipComponent;
  let fixture: ComponentFixture<AnnotationTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationTooltipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
