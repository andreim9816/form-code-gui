import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {FormSectionField} from '../../../model/FormSectionField';

@Component({
  selector: 'app-edit-form-number',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './edit-form-number.component.html'
})
export class EditFormNumberComponent {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  submitted = false;
}
