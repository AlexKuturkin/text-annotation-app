import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTooltip } from './annotation-tooltip';

describe('AnnotationTooltip', () => {
  let component: AnnotationTooltip;
  let fixture: ComponentFixture<AnnotationTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationTooltip],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationTooltip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
