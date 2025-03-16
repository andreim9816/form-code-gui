import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {FormSectionField} from '../../../model/FormSectionField';

@Component({
  selector: 'app-edit-form-number',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './edit-form-number.component.html'
})
export class EditFormNumberComponent {
  @Input()
  formSectionField: FormSectionField;
}
