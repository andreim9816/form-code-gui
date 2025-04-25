import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
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
import {FormSectionField} from '../../model/FormSectionField';
import {StorageService} from '../../service/StorageService';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../service/notification-service';
import {EditFormFileComponent} from '../edit-form-content/edit-form-file/edit-form-file.component';

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
    EditFormDateComponent,
    EditFormFileComponent
  ],
  templateUrl: './edit-form.component.html'
})
export class EditFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  formGroup: FormGroup;
  form: Form;
  formId: number;
  submitted = false;

  filesChanged: { file: File | null, contentFileId: number }[] = [];

  constructor(private readonly route: ActivatedRoute,
              private readonly fb: FormBuilder,
              private readonly httpService: HttpService,
              private readonly router: Router,
              private readonly notificationService: NotificationService,
              readonly storageService: StorageService) {
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

  isDisabledField(formSection: FormSection, formSectionField?: FormSectionField | undefined): boolean {
    const currentUserFromToken = this.storageService.getUser().id;
    if (this.form.currentUser === null || this.form.currentUser === undefined) {
      return true; // if form is finished and doesn't have a currentUser, then the field should be disabled
    }
    if (this.form.currentUser.id !== currentUserFromToken) {
      return true;
    }
    if (formSectionField !== undefined
      && formSectionField.sectionField.personalDataType !== null
      && formSectionField.sectionField.personalDataType !== undefined
    ) {
      return true;
    }
    // if it's my turn, then display the formSection if it's between currentSectionId and currentValidationSectionId
    if (this.form.currentSectionId === this.form.currentValidationSectionId) {
      return formSection.id !== this.form.currentSectionId;
    } else {
      return !(this.form.currentSectionId <= formSection.id && formSection.id < this.form.currentValidationSectionId);
    }
  }

  submit(): void {
    this.displayAllControlError();
    // this.removeRequiredValidatorToEnabledControls();
    this.submitted = true;

    if (this.formGroup.invalid) {
      console.error('invalid form');
      return;
    }
    this.updateFormSectionFieldsWithFormControlValues(); // used for sending data to backend

    const currentFormSections = this.form.formSections
      .filter(formSection => !this.isDisabledField(formSection));

    const body = {formSections: currentFormSections} as FormSectionUpdate;
    console.log(body);

    this.httpService.updateForm(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.router.navigate(['/forms']);
          this.notificationService.displayNotificationMessage("Successfully submitted");
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.message;
          this.notificationService.displayNotificationError(errorMessage);
        }
      });

    for (let x of this.filesChanged) {
      this.uploadFile(x.contentFileId, x.file).subscribe({
        next: (result) => {
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
    }
  }

  rejectForm(): void {
    this.addRequiredValidatorToEnabledControls();
    this.displayAllControlError();
    this.submitted = true;

    if (!this.formGroup.valid) {
      console.log('invalid formGroup');
      return;
    }
    this.updateFormSectionFieldsWithFormControlValues(); // used for sending data to backend

    const currentFormSections = this.form.formSections
      .filter(formSection => !this.isDisabledField(formSection));

    const body = {formSections: currentFormSections} as FormSectionUpdate;
    console.log(body);

    this.httpService.rejectForm(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.router.navigate(['/forms']);
          this.notificationService.displayNotificationMessage("Form rejected");
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.message;
          this.notificationService.displayNotificationError(errorMessage);
        }
      })
  }

  uploadFile(contentFileId: number, file: File | null) {
    const formData = new FormData();
    formData.append(`dtos[0].id`, contentFileId.toString());

    if (file == null) {
      formData.append('file', new Blob([], { type: 'application/octet-stream' }));
      formData.append(`dtos[0].isNullFile`, 'true');
    } else {
      formData.append(`dtos[0].content`, file);
    }

    return this.httpService.uploadFiles(formData);
  }

  addRequiredValidatorToEnabledControls(): void {
    this.sectionControls().controls.forEach((formSection) => {
      const formSectionFields = formSection.get('formSectionFields') as FormArray;

      formSectionFields.controls.forEach((fieldControl) => {
        if (!fieldControl.disabled) {
          console.log(fieldControl)
          fieldControl.setValidators(Validators.required);
          fieldControl.updateValueAndValidity()
        }
      });
    });
  }

  removeRequiredValidatorToEnabledControls(): void {
    this.sectionControls().controls.forEach((formSection, formSectionIdx) => {
      const formSectionFields = formSection.get('formSectionFields') as FormArray;

      formSectionFields.controls.forEach((fieldControl, fieldIndex) => {
        if (!fieldControl.disabled) {
          fieldControl.setValidators(null);
          fieldControl.updateValueAndValidity()
        }
      });
    });
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

    this.form.formSections.forEach((section) => {
      const sectionGroup = this.fb.group({
        formSectionFields: this.fb.array([])
      });
      const formSectionFieldsArray = sectionGroup.get('formSectionFields') as FormArray;

      section.formSectionFields.forEach((field) => {
        const fieldControl = new FormControl(
          {
            value: this.getValueForControl(field),
            disabled: this.isDisabledField(section, field)
          },
          this.getValidators(section, field.sectionField)
        );

        formSectionFieldsArray.push(fieldControl);
      });

      formSectionsArray.push(sectionGroup);
    });
    // console.log(this.formGroup);
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

  getValueForControl(field: FormSectionField) {
    if (field.sectionField.defaultValue !== null) {
      return field.sectionField.defaultValue;
    }
    if (field.sectionField.contentType === ContentType.STRING) {
      return field.contentString.value;
    }
    if (field.sectionField.contentType === ContentType.NUMBER) {
      return field.contentNumber.value;
    }
    if (field.sectionField.contentType === ContentType.DATE) {
      return field.contentDate.value;
    }
    return null;
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

  newFileSelected(event: { file: File | null, contentFileId: number }) {
    const elementInArray = this.filesChanged
      .findIndex(x => x.contentFileId === event.contentFileId);
    if (elementInArray === -1) {
      this.filesChanged.push(event);
    } else {
      this.filesChanged[elementInArray].file = event.file;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  readonly ContentType = ContentType;
}
