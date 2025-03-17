import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-date',
  imports: [
    FormsModule
  ],
  templateUrl: './date.component.html'
})
export class DateComponent {
  @Input()
  sectionField: SectionField;

  onInputChange(event: any) {
    let value = event.target.value;
    this.sectionField.defaultValue = value.trim() === '' ? null : value;
  }
}
