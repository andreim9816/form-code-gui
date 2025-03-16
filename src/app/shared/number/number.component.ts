import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-number',
  imports: [
    FormsModule
  ],
  templateUrl: './number.component.html'
})
export class NumberComponent {
  @Input()
  sectionField: SectionField;
}
