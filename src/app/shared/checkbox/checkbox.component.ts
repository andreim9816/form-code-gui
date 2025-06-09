import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {
  @Input()
  sectionField: SectionField;
}
