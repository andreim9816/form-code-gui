import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Section} from '../../model/Section';
import {CommonModule} from '@angular/common';
import {SectionField} from '../../model/SectionField';
import {ContentType} from '../../model/ContentType';
import {TextComponent} from '../../shared/text/text.component';
import {NumberComponent} from '../../shared/number/number.component';
import {HtmlUtils} from '../../util/HtmlUtils';
import {BreaklineComponent} from '../../shared/breakline/breakline.component';
import {DateComponent} from '../../shared/date/date.component';
import {CheckboxComponent} from '../../shared/checkbox/checkbox.component';
import {HttpService} from '../../service/HttpService';
import {MatDialog} from '@angular/material/dialog';
import {TextValidatorComponent} from '../validations/text-validator/text-validator.component';
import {NumberValidatorComponent} from '../validations/number-validator/number-validator.component';
import {DateValidatorComponent} from '../validations/date-validator/date-validator.component';
import {MatOption} from '@angular/material/core';
import {MatSelect, MatSelectTrigger} from '@angular/material/select';
import {CompanyRole} from '../../model/CompanyRole';
import {Subject, takeUntil} from 'rxjs';
import {Company} from '../../model/Company';
import {ActivatedRoute, Router} from '@angular/router';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../service/notification-service';
import {FileComponent} from '../../shared/file/file.component';
import {Template} from '../../model/Template';

@Component({
  selector: 'app-create-template',
  standalone: true,
  imports: [
    SweetAlert2Module,
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    TextComponent,
    NumberComponent,
    BreaklineComponent,
    DateComponent,
    CheckboxComponent,
    TextValidatorComponent,
    NumberValidatorComponent,
    DateValidatorComponent,
    MatOption,
    MatSelect,
    FormsModule,
    MatSelectTrigger,
    FileComponent,
  ],
  templateUrl: './create-template.component.html',
  styleUrls: ['create-template.component.css']
})
export class CreateTemplateComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('contextMenu') contextMenu!: ElementRef;
  contextMenuStyles = {display: 'none', top: '0px', left: '0px'};

// TODO: nu pot adauga nimic dupa un numar / date / breakline
  public readonly BREAK_LINE = 'BREAKLINE';
  currentFieldType: ContentType;
  form: FormGroup;
  sections: Section[] = [];
  company: Company;
  rolesForCompanies: CompanyRole[] = [];

  template: Template;
  templateId: number;

  cursorPositionInField: number | undefined;

  currentSectionIndex: number | undefined;
  currentSectionFieldIndex: number | undefined;

  viewChecked = false;

  destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly httpService: HttpService,
              private readonly notificationService: NotificationService,
              private readonly router: Router,
              protected readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    document.addEventListener('click', (event) => this.onClickOutside(event));
    this.getTemplate();
    this.getCompanyRoles();
  }

  getCompanyRoles() {
    this.httpService.getCompanyRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rolesForCompanies => {
        this.rolesForCompanies = rolesForCompanies;
      });
  }

  getTemplate() {
    if (this.isEditTemplateView()) {
      let templateIdd = this.route.snapshot.paramMap.get('id');
      this.templateId = Number(templateIdd);

      this.httpService.getTemplate(this.templateId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(template => {
          this.template = template

          this.form = this.fb.group({
            templateNameCtrl: [template.title, Validators.required],
            templateDescriptionCtrl: [template.description, Validators.required]
          });
          this.sections = this.template.sections;
        });
    } else {
      this.form = this.fb.group({
        templateNameCtrl: [undefined, Validators.required],
        templateDescriptionCtrl: [undefined, Validators.required]
      });
      this.sections = [
        this.createNewSection('Input section', false),
        this.createNewSection('Validation section', true)
      ];
    }
  }

  isEditTemplateView(): boolean {
    let templateId = this.route.snapshot.paramMap.get('id');
    return templateId != null;
  }

  ngAfterViewChecked() {
    if (this.viewChecked && this.getCurrentSectionField()) {
      const htmlElement = document.getElementById('' + this.getCurrentSectionField()?.id) as HTMLElement;
      if (htmlElement) {
        htmlElement.focus();
      }
      this.viewChecked = false;
    }
  }

  createNewSection(title: string | undefined, isValidation: boolean) {
    return {
      title: title,
      isValidation: isValidation,
      sectionFields: [this.newTextField(null)]
    } as Section;
  }

  addNewSectionAtTheEnd(title: string | undefined, isValidation: boolean): void {
    const newSection = this.createNewSection(title, isValidation);
    this.sections.push(newSection);
  }

  addNewFieldInCurrentSection(newField: SectionField): void {
    if (this.currentSectionIndex == undefined || this.currentSectionFieldIndex == undefined) {
      return;
    }

    if (this.sections[this.currentSectionIndex].sectionFields[this.currentSectionFieldIndex].contentType === ContentType.STRING) {
      if (this.cursorPositionInField === undefined) {
        return;
      }
      this.addNewFieldInsideString(newField);
    } else {
      this.addNewFieldNotInsideString(newField);
    }
  }

  addNewFieldInsideString(newField: SectionField): void {
    const contentInFieldBefore = this.getCurrentSectionField()?.defaultValue?.slice(0, this.cursorPositionInField) ?? '';
    const contentInFieldAfter = this.getCurrentSectionField()?.defaultValue?.slice(this.cursorPositionInField) ?? '';

    const fieldBefore = this.newTextField({
        defaultValue: contentInFieldBefore,
        personalDataType: this.getCurrentSectionField()?.personalDataType
      } as SectionField
    );
    const fieldAfter = this.newTextField({
        defaultValue: contentInFieldAfter,
        personalDataType: this.getCurrentSectionField()?.personalDataType
      } as SectionField
    );

    this.removeSectionFieldAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!);

    // if ((fieldBefore.defaultValue ?? '').length > 0) {
    this.addAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!++, fieldBefore);
    // }

    this.addAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!++, newField);

    if ((fieldAfter.defaultValue ?? '').length > 0) {
      this.addAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!--, fieldAfter);
    }

    this.cursorPositionInField = 0;
    this.viewChecked = true;
  }

  addNewFieldNotInsideString(newField: SectionField): void {
    this.addAtIdx(this.currentSectionIndex!, ++this.currentSectionFieldIndex!, newField);

    this.cursorPositionInField = undefined;
    this.viewChecked = true;
  }

  addNumber(): void {
    // if (
    //   this.getCurrentSectionField()?.contentType === ContentType.STRING
    // ) {
    this.setCurrentFieldType(ContentType.NUMBER);
    const newField = this.newNumberField();
    this.addNewFieldInCurrentSection(newField);
    // }
  }

  addText(): void {
    this.setCurrentFieldType(ContentType.STRING);
    const newField = this.newTextField(null);
    this.addNewFieldInCurrentSection(newField);
  }

  addFileAttachment(): void {
    this.setCurrentFieldType(ContentType.FILE);
    const newField = this.newFileField();
    this.addNewFieldInCurrentSection(newField);
  }

  addNewBreakLine(): void {
    if (
      this.getCurrentSectionField()?.defaultValue !== ''
    ) {
      this.setCurrentFieldType(ContentType.BREAK_LINE);
      const newField = this.newBreakLineField();
      this.addNewFieldInCurrentSection(newField);

      this.clearSectionIndex();
    }
  }

  addDate(): void {
    this.setCurrentFieldType(ContentType.DATE);
    const newField = this.newDateField();
    this.addNewFieldInCurrentSection(newField);
  }

  // addCheckbox(): void {
  //   this.setCurrentFieldType(ContentType.BOOLEAN);
  //   const newField = this.newCheckboxField();
  //   this.addNewFieldInCurrentSection(newField);
  // }

  removeElement(): void {
    const currentElement = this.getCurrentSectionField();
    if (currentElement) {
      this.removeSectionFieldAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!);
    }
  }

  submit(): void {
    this.displayInfo();

    if (this.form.invalid) {
      return;
    }

    if (this.isEditTemplateView()) {
      this.httpService.updateTemplate(this.templateId, this.template)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: result => {
            this.router.navigateByUrl('/templates');
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage = err.error.message;
            this.notificationService.displayNotificationError(errorMessage);
          }
        });
    } else {
      const body = {
        title: this.form.controls['templateNameCtrl'].value,
        description: this.form.controls['templateDescriptionCtrl'].value,
        sections: this.sections
      }
      this.httpService.createTemplate(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: result => {
            this.router.navigateByUrl('/forms');
          },
          error: (err: HttpErrorResponse) => {
            const errorMessage = err.error.message;
            this.notificationService.displayNotificationError(errorMessage);
          }
        });
    }
  }

  onCardBodyClick(event: MouseEvent, sectionIndex: number): void {
    const target = event.target as HTMLElement;
    const cardBody = target.closest('.card-body');

    if (cardBody === target) {
      console.log('Card body clicked, but not on a child component.');
      this.clearSectionIndex();
    }
    this.currentSectionIndex = sectionIndex;
  }

  clearSectionIndex(): void {
    this.cursorPositionInField = undefined;
    this.currentSectionFieldIndex = undefined;
  }

  newTextField(sectionField: SectionField | null): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: sectionField?.defaultValue,
      contentType: ContentType.STRING,
      personalDataType: sectionField?.personalDataType,
      textValidator: {
        id: sectionField?.textValidator?.id,
        isRequired: sectionField?.textValidator?.isRequired ?? true,
        minSize: sectionField?.textValidator?.minSize,
        maxSize: sectionField?.textValidator?.maxSize,
        isEmail: sectionField?.textValidator?.isEmail,
        isNoSpace: sectionField?.textValidator?.isNoSpace,
        isNoNumber: sectionField?.textValidator?.isNoNumber,
        regex: sectionField?.textValidator?.regex,
      }
    } as SectionField;
  }

  newFileField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: null,
      contentType: ContentType.FILE
    } as SectionField;
  }

  newBreakLineField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: null,
      contentType: ContentType.BREAK_LINE,
    } as SectionField;
  }

  newNumberField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: null,
      contentType: ContentType.NUMBER,
      numberValidator: {
        id: undefined,
        isRequired: true,
        minValue: undefined,
        maxValue: undefined,
      } as any
    } as SectionField;
  }

  newDateField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: null,
      contentType: ContentType.DATE,
      dateValidator: {}
    } as SectionField;
  }

  // newCheckboxField(): SectionField {
  //   return {
  //     id: HtmlUtils.generateUUID(),
  //     addedDate: new Date(),
  //     contentType: ContentType.BOOLEAN,
  //     contentString: undefined,
  //     contentNumber: undefined,
  //     contentDate: undefined,
  //     contentBoolean: {
  //       id: undefined,
  //       value: false,
  //       label: ''
  //     }
  //   } as SectionField;
  // }

  displayInfo(): void {
    console.log(this.sections);
  }

  addAtIdx(sectionIndex: number, fieldIndex: number, newElem: SectionField): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 0, newElem);
  }

  removeSectionFieldAtIdx(sectionIndex: number, fieldIndex: number): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 1);
  }

  addNewSectionAfterCurrentSection(title: string | undefined, isValidation: boolean): void {
    if (this.currentSectionIndex !== undefined) {
      const newSection = this.createNewSection(title, isValidation);
      this.sections.splice(this.currentSectionIndex + 1, 0, newSection);
      this.closeContextMenu();
    }
  }

  removeSectionAtIdx(sectionIndex: number): void {
    this.sections.splice(sectionIndex, 1);
  }

  handleOnClick(sectionIndex: number, sectionFieldIndex: number) {
    this.currentSectionIndex = sectionIndex
    this.currentSectionFieldIndex = sectionFieldIndex
  }

  setDataFromTextComponent(event: any) {
    this.cursorPositionInField = event.cursorPositionInField;
    this.currentSectionIndex = event.currentSectionIndex;
    this.currentSectionFieldIndex = event.currentSectionFieldIndex;
  }

  getCurrentSectionField(): SectionField | undefined {
    if (this.currentSectionIndex == null || this.currentSectionFieldIndex == null) {
      return undefined;
    }
    return this.sections[this.currentSectionIndex]?.sectionFields[this.currentSectionFieldIndex];
  }

  getCurrentSection(): Section | undefined {
    if (this.currentSectionIndex == null) {
      return undefined;
    }
    return this.sections[this.currentSectionIndex];
  }

  setCurrentFieldType(contentType: ContentType) {
    this.currentFieldType = contentType;
  }

  displayValidatorColumn(): boolean {
    const currentSectionField = this.getCurrentSectionField();
    if (currentSectionField === undefined) {
      return false;
    }
    const currentSection = this.getCurrentSection();
    if (currentSection === undefined) {
      return false;
    }
    if (currentSection.isValidation === true) {
      return false;
    }
    if (this.getCurrentSectionField()?.contentType === ContentType.BREAK_LINE) {
      return false;
    }
    if (currentSectionField.defaultValue == null || currentSectionField.defaultValue === '') {
      return true;
    }
    return false;
  }

  displayDeleteSectionField(): boolean {
    const currentSectionField = this.getCurrentSectionField();
    if (!currentSectionField) {
      return false;
    }
    return true;
  }

  // createTemplate(): Observable<> {
  //   const templateName = this.form.controls['templateNameCtrl'].value;
  //   return this.httpService.saveTemplate({
  //     templateName,
  //     sections: this.sections
  //   });
  // }

  ////////////////////////////////////////// contextual menu //////////////////////////////////////////

  openContextMenu(event: MouseEvent, sectionIndex: number) {
    event.preventDefault(); // Prevent the default right-click menu
    this.currentSectionIndex = sectionIndex;

    // Position the menu at the mouse cursor
    this.contextMenuStyles = {
      display: 'block',
      top: `${event.pageY}px`,
      left: `${event.pageX}px`,
    };
  }

  setCurrentIndexesAndOpenContextMenu(sectionIndex: number, sectionFieldIndex: number, event: MouseEvent) {
    this.handleOnClick(sectionIndex, sectionFieldIndex);
    this.openContextMenu(event, sectionIndex);
  }

  closeContextMenu() {
    this.contextMenuStyles = {display: 'none', top: '0px', left: '0px'};
  }

  // Close menu when clicking outside
  onClickOutside(event: Event) {
    if (!this.contextMenu.nativeElement.contains(event.target)) {
      this.closeContextMenu();
    }
  }

  onDeleteCurrentField() {
    this.removeElement();
    this.closeContextMenu();
  }

  deleteCurrentSection(): void {
    if (this.currentSectionIndex !== undefined) {
      this.removeSectionAtIdx(this.currentSectionIndex);
      const nextSection = this.sections[this.currentSectionIndex];
      if (nextSection !== undefined
        && nextSection.isValidation === true
        && (this.currentSectionIndex == 0 || this.sections[this.currentSectionIndex - 1].isValidation === true)) {
        this.removeSectionAtIdx(this.currentSectionIndex);
      }
      this.closeContextMenu();
    }
  }

  deleteSectionAtIdx(idx: number): void {
    this.currentSectionIndex = idx;
    this.deleteCurrentSection();
  }

  compareRoles = (r1: any, r2: any) => r1 && r2 && r1.id === r2.id;

  ////////////////////////////////////////// contextual menu //////////////////////////////////////////

  onDismiss(): void {
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  readonly ContentType = ContentType;
}
