import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SectionField} from '../../../model/SectionField';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TextCustomValidator} from '../../../enum/TextCustomValidator';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgIf} from '@angular/common';
import {DateCustomValidator} from '../../../enum/DateCustomValidator';

@Component({
  selector: 'app-date-validator',
  imports: [
    MatOption,
    MatSelect,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './date-validator.component.html'
})
export class DateValidatorComponent implements OnInit, OnChanges {
  @Input()
  sectionField: SectionField;
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.sectionField) {
      this.createFormAndListenToChanges();
    }
  }

  ngOnInit(): void {
    this.createFormAndListenToChanges();
  }

  createFormAndListenToChanges(): void {
    this.createFormGroup();
    this.onFormChanges();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      isRequiredCtrl: this.sectionField.dateValidator!.isRequired ?? true,
      startDateCtrl: this.sectionField.dateValidator!.startDate,
      endDateCtrl: this.sectionField.dateValidator!.endDate,
      timeDateCtrl: this.sectionField.dateValidator!.timeDate
    }, {
      validators: this.maxSizeValueGoeThanMinSize
    });
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.sectionField.dateValidator!.isRequired = formValues.isRequiredCtrl;
        this.sectionField.dateValidator!.startDate = formValues.startDateCtrl;
        this.sectionField.dateValidator!.endDate = formValues.endDateCtrl;
        this.sectionField.dateValidator!.timeDate = formValues.timeDateCtrl;
      }
    })
  }

  maxSizeValueGoeThanMinSize(group: AbstractControl): null {
    const startDateCtrl = group.get('startDateCtrl')!;
    const endDateCtrl = group.get('endDateCtrl')!;
    const currentErrors = endDateCtrl.errors || {};

    if (!endDateCtrl) {
      return null;
    }

    const minSize = startDateCtrl.value;
    const maxSize = endDateCtrl.value;

    if (minSize !== null && maxSize !== null && minSize > maxSize) {
      currentErrors['lessThanFirst'] = true
      endDateCtrl.setErrors(currentErrors);
    } else {
      delete currentErrors['lessThanFirst'];

      if (Object.keys(currentErrors).length === 0) {
        endDateCtrl.setErrors(null);
      } else {
        endDateCtrl.setErrors(currentErrors);
      }
    }
    return null;
  }

  readonly TextCustomValidator = TextCustomValidator;
  protected readonly DateCustomValidator = DateCustomValidator;
}
