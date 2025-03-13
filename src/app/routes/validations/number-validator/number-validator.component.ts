import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SectionField} from '../../../model/SectionField';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-number-validator',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './number-validator.component.html'
})
export class NumberValidatorComponent implements OnInit, OnChanges {
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
      isRequiredCtrl: this.sectionField.numberValidator!.isRequired ?? true,
      minValueCtrl: [this.sectionField.numberValidator!.minValue ?? 1],
      maxValueCtrl: [this.sectionField.numberValidator!.maxValue],
    }, {
      validators: this.minValueGoeThanMaxValue
    });
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.sectionField.numberValidator!.isRequired = formValues.isRequiredCtrl;
        this.sectionField.numberValidator!.minValue = formValues.minValueCtrl;
        this.sectionField.numberValidator!.maxValue = formValues.maxValueCtrl;
        console.log(this.sectionField);
      }
    })
  }

  minValueGoeThanMaxValue(group: AbstractControl): null {
    const minValueCtrl = group.get('minValueCtrl')!;
    const maxValueCtrl = group.get('maxValueCtrl')!;
    const currentErrors = maxValueCtrl.errors || {};

    if (!maxValueCtrl) {
      return null;
    }

    const minValue = minValueCtrl.value;
    const maxValue = maxValueCtrl.value;

    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      currentErrors['lessThanFirst'] = true
      maxValueCtrl.setErrors(currentErrors);
    } else {
      delete currentErrors['lessThanFirst'];

      if (Object.keys(currentErrors).length === 0) {
        maxValueCtrl.setErrors(null);
      } else {
        maxValueCtrl.setErrors(currentErrors);
      }
    }
    return null;
  }
}
