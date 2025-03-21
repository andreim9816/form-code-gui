import {Component, Input} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateCustomValidator} from '../../../enum/DateCustomValidator';

@Component({
  selector: 'app-edit-form-date',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './edit-form-date.component.html'
})
export class EditFormDateComponent {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  submitted = false;

  onDateInput(event: any) {
    const value = event.target.value;
    this.fieldControl.setValue(value);
  }

  protected readonly DateCustomValidator = DateCustomValidator;
}
