import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Section} from '../../model/Section';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
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
import {DialogConfirmDeleteComponent} from '../dialog-confirm-delete/dialog-confirm-delete.component';
import {TextValidatorComponent} from '../validations/text-validator/text-validator.component';
import {NumberValidatorComponent} from '../validations/number-validator/number-validator.component';
import {DateValidatorComponent} from '../validations/date-validator/date-validator.component';
import {DateValidator} from '../../model/DateValidator';
import {DateCustomValidator} from '../../enum/DateCustomValidator';

@Component({
  selector: 'app-create-template',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatLabel,
    MatFormField,
    MatInput,
    MatFabButton,
    NgForOf,
    NgIf,
    TextComponent,
    NumberComponent,
    BreaklineComponent,
    DateComponent,
    CheckboxComponent,
    TextValidatorComponent,
    NumberValidatorComponent,
    DateValidatorComponent,
  ],
  templateUrl: './create-template.component.html'
})
export class CreateTemplateComponent implements OnInit, AfterViewChecked {
  @ViewChild('contextMenu') contextMenu!: ElementRef;
  contextMenuStyles = {display: 'none', top: '0px', left: '0px'};

// TODO: nu pot adauga nimic dupa un numar / date / breakline
  public readonly BREAK_LINE = 'BREAKLINE';
  currentFieldType: ContentType;
  form: FormGroup;
  sections: Section[] = [];

  cursorPositionInField: number | undefined;

  currentSectionIndex: number | undefined;
  currentSectionFieldIndex: number | undefined;

  mockData = true;
  viewChecked = false;

  constructor(private readonly fb: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly httpService: HttpService) {
  }

  ngOnInit(): void {
    document.addEventListener('click', (event) => this.onClickOutside(event));

    this.form = this.fb.group({
      companyCtrl: ['ANAF', Validators.required],
      formNameCtrl: ['', Validators.required]
    });

    if (this.mockData) {
      this.sections = [
        {
          title: 'Sectiunea 1',
          isValidation: false,
          sectionFields: [
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: 'Subsemnatul',
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: 'domiciliat in',
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: 'nascut in data de',
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.DATE,
              dateValidator: {
                id: undefined as any,
                startDate: undefined as any,
                endDate: undefined as any,
                isRequired: true,
                dateTime: DateCustomValidator.PAST_DATE
              } as DateValidator
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: 'si avand CNP',
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: 'declar urmatoarele:',
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.BREAK_LINE,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.STRING,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.BREAK_LINE,
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              defaultValue: 'In momentul de fata am urmatoarele coduri fiscale:',
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              defaultValue: null,
              contentType: ContentType.NUMBER
            }
          ]
        }
      ] as Section[];
    }
  }

  ngAfterViewChecked() {
    if (this.viewChecked && this.getCurrentSectionField()) {
      const htmlElement = document.getElementById('' + this.getCurrentSectionField()?.id) as HTMLElement;
      htmlElement.focus();
      this.viewChecked = false;
    }
  }

  createNewSection(title: string | undefined, isValidation: boolean) {
    return {
      title: title,
      isValidation: isValidation,
      sectionFields: [this.newTextField()]
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

    const fieldBefore = this.newTextField(contentInFieldBefore);
    const fieldAfter = this.newTextField(contentInFieldAfter);

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
    const newField = this.newTextField();
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
      // open dialog
      const dialogRef = this.dialog.open(DialogConfirmDeleteComponent, {
        data: currentElement,
        width: '350px',
        height: '350px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.removeSectionFieldAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!);
        }
      });
    }
  }

  submit(): void {
    this.displayInfo();
    const companyId = 1;
    const body = {
      title: 'Title',
      description: 'Description',
      sections: this.sections
    }
    this.httpService.saveTemplate(companyId, body)
      .subscribe({
        next: result => {
          console.log(result);
        },
        error: err => {
          console.error(err);
        }
      })
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

  newTextField(content: any = null): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      defaultValue: content,
      contentType: ContentType.STRING,
      textValidator: {
        id: undefined,
        isRequired: true,
        minSize: undefined,
        maxSize: undefined,
        isEmail: undefined,
        isNoSpace: undefined,
        isNoNumber: undefined,
        regex: undefined
      }
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
    if (currentSectionField.defaultValue === null) {
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

  ////////////////////////////////////////// contextual menu //////////////////////////////////////////

  readonly ContentType = ContentType;
}
