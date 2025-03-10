import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {TextCustomValidator} from '../../../enum/TextCustomValidator';
import {SectionField} from '../../../model/SectionField';

@Component({
  selector: 'app-text-validator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule
  ],
  templateUrl: './text-validator.component.html'
})
export class TextValidatorComponent implements OnInit, OnChanges {
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
    const customValidators = [];
    if (this.sectionField.textValidator.isEmail) {
      customValidators.push(TextCustomValidator.IsEmail);
    }
    if (this.sectionField.textValidator.isNoNumber) {
      customValidators.push(TextCustomValidator.IsNoNumbers);
    }
    if (this.sectionField.textValidator.isNoSpace) {
      customValidators.push(TextCustomValidator.IsNoSpaces);
    }

    this.formGroup = this.fb.group({
      isRequiredCtrl: this.sectionField.textValidator.isRequired ?? true,
      minSizeCtrl: [this.sectionField.textValidator.minSize ?? 1, Validators.min(0)],
      maxSizeCtrl: [this.sectionField.textValidator.maxSize, Validators.min(1)],
      customValidatorsCtrl: [customValidators],
      regexCtrl: [this.sectionField.textValidator.regex]
    }, {
      validators: this.maxSizeValueGoeThanMinSize
    });
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.sectionField.textValidator.isRequired = formValues.isRequiredCtrl;
        this.sectionField.textValidator.minSize = formValues.minSizeCtrl;
        this.sectionField.textValidator.maxSize = formValues.maxSizeCtrl;
        this.sectionField.textValidator.regex = formValues.regexCtrl;

        this.sectionField.textValidator.isNoSpace = formValues.customValidatorsCtrl.includes(TextCustomValidator.IsNoSpaces)
        this.sectionField.textValidator.isEmail = formValues.customValidatorsCtrl.includes(TextCustomValidator.IsEmail)
        this.sectionField.textValidator.isNoNumber = formValues.customValidatorsCtrl.includes(TextCustomValidator.IsNoNumbers)

        console.log(this.sectionField);
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
