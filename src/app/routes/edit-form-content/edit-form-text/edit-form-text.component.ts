import {Component, Input} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-form-text',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './edit-form-text.component.html'
})
export class EditFormTextComponent {
  @Input()
  formSectionField: FormSectionField;
}
