import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-annotation-tooltip',
  imports: [],
  standalone: true,
  templateUrl: './annotation-tooltip.component.html',
  styleUrl: './annotation-tooltip.component.scss',
})
export class AnnotationTooltipComponent {
  @Input() note = '';
}
