import {Component, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {FormSectionField} from '../../../model/FormSectionField';

@Component({
  selector: 'app-edit-form-number',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-form-number.component.html'
})
export class EditFormNumberComponent implements OnInit {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  isDisabled: boolean;

  ngOnInit() {
    console.log(this.fieldControl);

    this.fieldControl.valueChanges.subscribe((value: any) => {
      console.log(value);
      console.log(this.fieldControl.errors);
    });
  }
}
