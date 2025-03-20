import {Component, Input, OnInit} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-form-text',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-form-text.component.html'
})
export class EditFormTextComponent implements OnInit {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  isDisabled: boolean;

  ngOnInit() {
    // console.log(this.fieldControl);
    //
    // this.fieldControl.valueChanges.subscribe((value: any) => {
    //   console.log(value);
    //   console.log(this.fieldControl.errors);
    // });
  }
}
