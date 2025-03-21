import {Component, Input, OnInit} from '@angular/core';
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
export class EditFormDateComponent implements OnInit {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  isDisabled: boolean;
  @Input()
  submitted = false;

  ngOnInit() {
    console.log(this.fieldControl);
    this.fieldControl.valueChanges.subscribe((value: any) => {
      // if (typeof value === 'string') {
      //   const dateValue = new Date(value);
      //   this.fieldControl.setValue(this.formatDate(dateValue), {emitEvent: false});
      //   console.log(dateValue);
      //   console.log(this.fieldControl.errors);
      // }
    });
  }

  // convertToDate(dateString: string | null): Date | null {
  //   return dateString ? new Date(dateString) : null;
  // }
  //
  formatDate(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  onDateInput(event: any) {
    const value = event.target.value;
    this.fieldControl.setValue(value); // Store as string 'YYYY-MM-DD'
  }

  protected readonly DateCustomValidator = DateCustomValidator;
}
