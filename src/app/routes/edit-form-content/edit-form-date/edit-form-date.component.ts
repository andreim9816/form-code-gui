import {Component, Input, OnInit} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateCustomValidator} from '../../../enum/DateCustomValidator';
import {StorageService} from '../../../service/StorageService';

@Component({
  selector: 'app-edit-form-date',
  providers: [DatePipe],
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
  submitted = false;

  constructor(private readonly storageService: StorageService,
              private readonly datePipe: DatePipe) {
  }

  ngOnInit() {
    const dateValue = this.getDefaultValue();
    this.fieldControl.setValue(dateValue);
  }

  onDateInput(event: any) {
    const value = event.target.value;
    this.fieldControl.setValue(value);
  }

  isReadonlyField(): boolean {
    return this.formSectionField.sectionField.personalDataType !== null
      && this.formSectionField.sectionField.personalDataType !== undefined;
  }

  getDefaultValue() {
    if (this.formSectionField.contentDate != null) {
      return this.transformDate(this.formSectionField.contentDate.value);
    }
    if (this.isReadonlyField()) {
      const user = this.storageService.getUser();
      const dateOfBirth = user.dateOfBirth;
      if (dateOfBirth) {
        const date = new Date(dateOfBirth);
        return this.transformDate(date);
      }
    }
    return undefined;
  }

  transformDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || undefined;
  }

  protected readonly DateCustomValidator = DateCustomValidator;
}
