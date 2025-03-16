import {Component, Input} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-form-date',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './edit-form-date.component.html'
})
export class EditFormDateComponent {
  @Input()
  formSectionField: FormSectionField;
}
