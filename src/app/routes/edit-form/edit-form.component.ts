import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {ContentType} from '../../model/ContentType';
import {Form} from '../../model/Form';
import {EditFormTextComponent} from '../edit-form-content/edit-form-text/edit-form-text.component';
import {FormSection} from '../../model/FormSection';
import {SectionField} from '../../model/SectionField';
import {SectionLiteDto} from '../../model/SectionLiteDto';
import {EditFormNumberComponent} from '../edit-form-content/edit-form-number/edit-form-number.component';
import {EditFormDateComponent} from '../edit-form-content/edit-form-date/edit-form-date.component';
import {DateCustomValidator} from '../../enum/DateCustomValidator';
import {FormSectionStatus} from '../../enum/FormSectionStatus';
import {FormSectionUpdate} from '../../dto/request/FormSectionUpdate';

@Component({
  selector: 'app-edit-form',
  imports: [
    FormsModule,
    MatButton,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    EditFormTextComponent,
    EditFormNumberComponent,
    EditFormDateComponent
  ],
  templateUrl: './edit-form.component.html'
})
export class EditFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  formGroup: FormGroup;
  form: Form;
  formId: number;
  submitted = false;

  constructor(private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly httpService: HttpService) {
  }

  ngOnInit() {
    this.formId = Number(this.route.snapshot.paramMap.get('id')!);
    this.getFormById(this.formId);
  }

  getFormById(id: number) {
    this.httpService.getFormById(id).pipe(takeUntil(this.destroy$))
      .subscribe(form => {
        this.form = form;
        this.initializeForm();
      })
  }

  isDisabledField(formSection: FormSection): boolean {
    if (this.form.currentSectionId === this.form.currentValidationSectionId) {
      return formSection.id !== this.form.currentSectionId;
    }
    return formSection.id < this.form.currentSectionId || formSection.id >= this.form.currentValidationSectionId;
  }

  submit(): void {
    this.displayAllControlError();
    this.submitted = true;
    // if (this.formGroup.invalid) {
    //   return;
    // }

    this.updateFormSectionFieldsWithFormControlValues();

    const currentFormSections = this.form.formSections
      .filter(formSection => !this.isDisabledField(formSection));

    const body = {formSections: currentFormSections} as FormSectionUpdate;
    console.log(body);

    this.httpService.updateForm(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  updateFormSectionFieldsWithFormControlValues() {
    this.sectionControls().controls.forEach((formSection, formSectionIdx) => {
      const formSectionFields = this.sectionFieldsControls(formSection);// formSection.get('formSectionFields') as FormArray;
      formSectionFields.controls.forEach((fieldControl, fieldIndex) => {
        const formSectionField = this.form.formSections[formSectionIdx].formSectionFields[fieldIndex];

        //update only the fields that need to be completed by the user
        if (formSectionField.sectionField.defaultValue === null) {
          if (formSectionField.sectionField.contentType === ContentType.STRING) {
            formSectionField.contentString.value = fieldControl.value;
          } else if (formSectionField.sectionField.contentType === ContentType.NUMBER) {
            formSectionField.contentNumber.value = fieldControl.value;
          } else if (formSectionField.sectionField.contentType === ContentType.DATE) {
            formSectionField.contentDate.value = new Date(fieldControl.value);
          }
        }

        console.log(`Errors for Section ${formSectionIdx}, Field ${fieldIndex}:`, fieldControl.errors);
        console.log(`Values for Section ${formSectionIdx}, Field ${fieldIndex}:`, fieldControl.value);
      });
    });
  }

  initializeForm() {
    if (!this.form) return;

    this.formGroup = this.fb.group({
      formSections: this.fb.array([])
    });
    const formSectionsArray = this.formGroup.get('formSections') as FormArray;

    this.form.formSections.forEach((section, sectionIndex) => {
      const sectionGroup = this.fb.group({
        formSectionFields: this.fb.array([])
      });
      const formSectionFieldsArray = sectionGroup.get('formSectionFields') as FormArray;

      section.formSectionFields.forEach((field, fieldIndex) => {
        const fieldControl = new FormControl(
          {value: null, disabled: this.isDisabledField(section)},
          this.getValidators(section, field.sectionField)
        );

        formSectionFieldsArray.push(fieldControl);
      });

      formSectionsArray.push(sectionGroup);
    });
    console.log(this.formGroup);
  }

  displayAllControlError(): void {
    this.sectionControls().controls.forEach((formSection, formSectionIdx) => {
      const formSectionFields = formSection.get('formSectionFields') as FormArray;

      formSectionFields.controls.forEach((fieldControl, fieldIndex) => {
        console.log(`Errors for Section ${formSectionIdx}, Field ${fieldIndex}:`, fieldControl.errors);
        console.log(`Values for Section ${formSectionIdx}, Field ${fieldIndex}:`, fieldControl.value);
      });
    });
  }

  getValidators(section: FormSection, field: SectionField) {
    const validators: ValidatorFn[] = [];
    if (!field
      || field.defaultValue !== null
      || section.status === FormSectionStatus.IS_VALIDATION_SECTION) {
      return validators;
    }

    if (field.contentType === ContentType.STRING && field.textValidator) {
      return this.getValidatorsForText(field);
    }
    if (field.contentType === ContentType.NUMBER && field.numberValidator) {
      return this.getValidatorsForNumber(field);
    }
    if (field.contentType === ContentType.DATE && field.dateValidator) {
      return this.getValidatorsForDate(field);
    }
    return validators;
  }

  getValidatorsForText(field: SectionField) {
    const validators: ValidatorFn[] = [];
    const {isRequired, minSize, maxSize, isEmail, isNoSpace, isNoNumber, regex} = field.textValidator!;

    if (isRequired) validators.push(Validators.required);
    if (minSize !== null && minSize !== undefined) validators.push(Validators.minLength(minSize));
    if (maxSize !== null && maxSize !== undefined) validators.push(Validators.maxLength(maxSize));
    if (isEmail) validators.push(Validators.email);
    if (isNoSpace) validators.push(Validators.pattern(/^\S*$/)); // No spaces allowed
    if (isNoNumber) validators.push(Validators.pattern(/^[^\d]*$/)); // No numbers allowed
    if (regex) validators.push(Validators.pattern(regex)); // Custom regex

    return validators;
  }

  getValidatorsForNumber(field: SectionField) {
    const validators: ValidatorFn[] = [];
    const {isRequired, minValue, maxValue} = field.numberValidator!;

    if (isRequired) validators.push(Validators.required);
    if (minValue !== null && minValue !== undefined) validators.push(Validators.min(minValue));
    if (maxValue !== null && maxValue !== undefined) validators.push(Validators.max(maxValue));

    return validators;
  }

  getValidatorsForDate(field: SectionField) {
    const validators: ValidatorFn[] = [];
    const {isRequired, startDate, endDate, dateTime} = field.dateValidator!;

    if (isRequired) validators.push(Validators.required);
    if (startDate !== null && startDate !== undefined) {
      validators.push(control => {
        if (!control.value) return null;
        const controlDate = new Date(control.value).getTime();
        return controlDate > new Date(startDate).getTime() ? null : {
          startDate: {
            requiredValue: startDate,
            actualValue: controlDate
          }
        };
      });
    }
    if (endDate !== null && endDate !== undefined) {
      validators.push(control => {
        if (!control.value) return null;
        const controlDate = new Date(control.value).getTime();
        return controlDate <= new Date(endDate).getTime() ? null : {
          endDate: {
            requiredValue: endDate,
            actualValue: controlDate
          }
        };
      });
    }
    if (dateTime !== null && dateTime !== undefined) {
      validators.push(control => {
        if (!control.value) return null;
        const controlDate = new Date(control.value).getTime();
        if (dateTime === DateCustomValidator.PAST_DATE) {
          return controlDate < new Date().getTime() ? null : {
            dateTime: {
              actualValue: controlDate
            }
          }
        } else if (dateTime === DateCustomValidator.FUTURE_DATE) {
          return controlDate > new Date().getTime() ? null : {
            dateTime: {
              actualValue: controlDate
            }
          }
        } else return null;
      });
    }

    return validators;
  }

  sectionControls() {
    return this.formGroup.get('formSections') as FormArray;
  }

  sectionFieldsControls(sectionControl: AbstractControl) {
    return sectionControl.get('formSectionFields') as FormArray;
  }

  getFormSection(sectionIndex: number): FormSection {
    return this.form.formSections[sectionIndex];
  }

  getSection(sectionIndex: number): SectionLiteDto {
    return this.getFormSection(sectionIndex).section;
  }

  getFormSectionField(sectionIndex: number, sectionFieldIndex: number) {
    return this.getFormSection(sectionIndex).formSectionFields[sectionFieldIndex]
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  readonly ContentType = ContentType;
}
