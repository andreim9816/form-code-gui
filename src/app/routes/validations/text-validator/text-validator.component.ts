import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {TextCustomValidator} from '../../../enum/TextCustomValidator';
import {SectionField} from '../../../model/SectionField';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-text-validator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatLabel
  ],
  templateUrl: './text-validator.component.html'
})
export class TextValidatorComponent implements OnInit, OnChanges {
  @Input()
  sectionField: SectionField;
  formGroup: FormGroup;
  selectedPersonalDataType: PersonalDataType | null = null;

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
    if (this.sectionField.textValidator!.isEmail) {
      customValidators.push(TextCustomValidator.IS_EMAIL);
    }
    if (this.sectionField.textValidator!.isNoNumber) {
      customValidators.push(TextCustomValidator.IS_NO_NUMBERS);
    }
    if (this.sectionField.textValidator!.isNoSpace) {
      customValidators.push(TextCustomValidator.IS_NO_SPACES);
    }

    this.formGroup = this.fb.group({
      isRequiredCtrl: this.sectionField.textValidator!.isRequired ?? true,
      minSizeCtrl: [this.sectionField.textValidator!.minSize ?? 1, Validators.min(0)],
      maxSizeCtrl: [this.sectionField.textValidator!.maxSize, Validators.min(1)],
      customValidatorsCtrl: [customValidators],
      regexCtrl: [this.sectionField.textValidator!.regex]
    }, {
      validators: this.maxSizeValueGoeThanMinSize
    });
    this.selectedPersonalDataType = this.sectionField.personalDataType;
  }

  onFormChanges(): void {
    this.formGroup.valueChanges.subscribe(formValues => {
      if (this.formGroup.valid) {
        this.sectionField.textValidator!.isRequired = formValues.isRequiredCtrl;
        this.sectionField.textValidator!.minSize = formValues.minSizeCtrl;
        this.sectionField.textValidator!.maxSize = formValues.maxSizeCtrl;
        this.sectionField.textValidator!.regex = formValues.regexCtrl;

        this.sectionField.textValidator!.isNoSpace = formValues.customValidatorsCtrl.includes(TextCustomValidator.IS_NO_SPACES);
        this.sectionField.textValidator!.isEmail = formValues.customValidatorsCtrl.includes(TextCustomValidator.IS_EMAIL);
        this.sectionField.textValidator!.isNoNumber = formValues.customValidatorsCtrl.includes(TextCustomValidator.IS_NO_NUMBERS);
      }
    });
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

  onToggleClick(event: PersonalDataType) {
    if (this.selectedPersonalDataType === event) {
      this.selectedPersonalDataType = null;
    } else {
      this.selectedPersonalDataType = event;
    }

    this.sectionField.personalDataType = this.selectedPersonalDataType;
  }

  readonly TextCustomValidator = TextCustomValidator;
  readonly PersonalDataType = PersonalDataType;
}

export enum PersonalDataType {
  CNP,
  NAME,
  ADDRESS,
  DATE
}
