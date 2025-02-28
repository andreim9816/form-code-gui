import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';

@Component({
  selector: 'app-breakline',
  imports: [],
  templateUrl: './breakline.component.html'
})
export class BreaklineComponent {
  @Input()
  sectionField: SectionField;
}
