import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SectionField} from '../../../model/SectionField';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgIf} from '@angular/common';
import {DateCustomValidator} from '../../../enum/DateCustomValidator';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {PersonalDataType} from '../text-validator/text-validator.component';
import {MatButtonToggle} from '@angular/material/button-toggle';

@Component({
  selector: 'app-date-validator',
  standalone:true,
  imports: [
    MatOption,
    MatSelect,
    NgIf,
    ReactiveFormsModule,
    MatSlideToggle,
    FormsModule,
  ],
  templateUrl: './date-validator.component.html',
  styleUrls: ['./date-validator.component.scss']
})
export class DateValidatorComponent implements OnInit, OnChanges {
  @Input()
  sectionField: SectionField;
  formGroup: FormGroup;

  isBirthdayField: PersonalDataType | null;

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
      isRequiredCtrl: [{value: this.sectionField.dateValidator!.isRequired ?? true, /*disabled: this.isBirthdayField*/}],
      startDateCtrl: [{value: this.sectionField.dateValidator!.startDate, /*disabled: this.isBirthdayField*/}],
      endDateCtrl: [{value: this.sectionField.dateValidator!.endDate, /*disabled: this.isBirthdayField*/}],
      dateTimeCtrl: [{value: this.sectionField.dateValidator!.dateTime, /*disabled: this.isBirthdayField*/}]
    }, {
      validators: this.maxSizeValueGoeThanMinSize
    });
    this.isBirthdayField = this.sectionField.personalDataType;
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.sectionField.dateValidator!.isRequired = formValues.isRequiredCtrl;
        this.sectionField.dateValidator!.startDate = formValues.startDateCtrl;
        this.sectionField.dateValidator!.endDate = formValues.endDateCtrl;
        this.sectionField.dateValidator!.dateTime = formValues.dateTimeCtrl;
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

  onIsBirthdayFieldChanged(value: boolean): void {
    if (value === true) {
      this.isBirthdayField = PersonalDataType.DATE;
    } else {
      this.isBirthdayField = null;
    }
    this.sectionField.personalDataType = this.isBirthdayField;

    const controls = [
      'isRequiredCtrl',
      'startDateCtrl',
      'endDateCtrl',
      'dateTimeCtrl'
    ];

    // controls.forEach(controlName => {
    //   const control = this.formGroup.get(controlName);
    //   if (control) {
    //     if (value) {
    //       control.disable();
    //     } else {
    //       control.enable();
    //     }
    //   }
    // });
  }

  protected readonly DateCustomValidator = DateCustomValidator;
}
