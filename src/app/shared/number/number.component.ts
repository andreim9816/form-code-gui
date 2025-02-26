import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';

@Component({
  selector: 'app-number',
  imports: [],
  templateUrl: './number.component.html'
})
export class NumberComponent {
  @Input()
  sectionField: SectionField;
}
