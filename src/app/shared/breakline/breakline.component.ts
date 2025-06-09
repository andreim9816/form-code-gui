import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';

@Component({
  selector: 'app-breakline',
  standalone: true,
  imports: [],
  templateUrl: './breakline.component.html'
})
export class BreaklineComponent {
  @Input()
  sectionField: SectionField;
}
