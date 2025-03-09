import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {TextCustomValidator} from '../../../enum/TextCustomValidator';

@Component({
  selector: 'app-text-validator',
  imports: [
    CommonModule,
    FormsModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule
  ],
  templateUrl: './text-validator.component.html'
})
export class TextValidatorComponent implements OnInit {
  formGroup: FormGroup;

  @Output()
  validatorValues = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.onFormChanges();
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      isRequiredCtrl: true,
      minSizeCtrl: [1, Validators.min(0)],
      maxSizeCtrl: [undefined, Validators.min(1)],
      customValidatorsCtrl: [[]],
      regexCtrl: []
    }, {
      validators: this.maxSizeValueGoeThanMinSize
    });
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.validatorValues.emit(formValues);
      }
    })
  }

  maxSizeValueGoeThanMinSize(group: AbstractControl): null {
    const minSizeCtrl = group.get('minSizeCtrl')!;
    const maxSizeCtrl = group.get('maxSizeCtrl')!;
    const currentErrors = maxSizeCtrl.errors || {};

    if (!maxSizeCtrl) {
      return null;
    }

    const minSize = minSizeCtrl.value;
    const maxSize = maxSizeCtrl.value;

    if (minSize !== null && maxSize !== null && minSize > maxSize) {
      currentErrors['lessThanFirst'] = true
      maxSizeCtrl.setErrors(currentErrors);
    } else {
      delete currentErrors['lessThanFirst'];

      if (Object.keys(currentErrors).length === 0) {
        maxSizeCtrl.setErrors(null);
      } else {
        maxSizeCtrl.setErrors(currentErrors);
      }
    }
    return null;
  }

  protected readonly TextCustomValidator = TextCustomValidator;
}
