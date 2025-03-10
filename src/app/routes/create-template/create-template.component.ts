import {AfterViewChecked, Component, OnInit} from '@angular/core';
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
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {TextValidatorComponent} from '../validations/text-validator/text-validator.component';
import {TextCustomValidator} from '../../enum/TextCustomValidator';

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
  ],
  templateUrl: './create-template.component.html'
})
export class CreateTemplateComponent implements OnInit, AfterViewChecked {
// TODO: nu pot adauga nimic dupa un numar / date / breakline
  readonly BREAK_LINE = 'BREAKLINE';
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
    this.form = this.fb.group({
      companyCtrl: ['ANAF', Validators.required],
      formNameCtrl: ['', Validators.required]
    });

    if (this.mockData) {
      this.sections = [
        {
          sectionFields: [
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'abcdefghijkl'
              },
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.NUMBER,
              contentNumber: {
                value: 123
              }
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.DATE,
              contentDate: {
                value: new Date(2025, 10, 3)
              }
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'mno'
              },
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.BOOLEAN,
              contentBoolean: {
                value: false,
                label: 'label'
              }
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: this.BREAK_LINE
              },
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'pqrstuvwxyz'
              },
              textValidator: {}
            }
          ]
        },
        {
          sectionFields: [
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'xyz'
              },
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'tuv'
              },
              textValidator: {}
            },
            {
              id: HtmlUtils.generateUUID(),
              contentType: ContentType.STRING,
              contentString: {
                value: 'ciolacu'
              },
              textValidator: {}
            }
          ]
        },
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

  addNewSection(): void {
    const newSection = {
      content: '',
      sectionFields: [this.newTextField()]
    } as Section;

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
    const contentInFieldBefore = this.getCurrentSectionField()?.contentString?.value.slice(0, this.cursorPositionInField) ?? '';
    const contentInFieldAfter = this.getCurrentSectionField()?.contentString?.value.slice(this.cursorPositionInField) ?? '';

    const fieldBefore = this.newTextField(contentInFieldBefore);
    const fieldAfter = this.newTextField(contentInFieldAfter);

    this.removeAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!);

    if ((fieldBefore.contentString?.value ?? '').length > 0) {
      this.addAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!++, fieldBefore);
    }

    this.addAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!++, newField);

    if ((fieldAfter.contentString?.value ?? '').length > 0) {
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
    if (
      this.getCurrentSectionField()?.contentType === ContentType.STRING
    ) {
      this.setCurrentFieldType(ContentType.NUMBER);
      const newField = this.newNumberField();
      this.addNewFieldInCurrentSection(newField);
    }
  }

  addText(): void {
    this.setCurrentFieldType(ContentType.STRING);
    const newField = this.newTextField();
    this.addNewFieldInCurrentSection(newField);
  }

  addNewBreakLine(): void {
    if (
      this.getCurrentSectionField()?.contentString?.value !== ''
    ) {
      this.setCurrentFieldType(ContentType.BREAK_LINE);
      const newField = this.newTextField(this.BREAK_LINE);
      this.addNewFieldInCurrentSection(newField);

      this.clearSectionIndex();
    }
  }

  addDate(): void {
    this.setCurrentFieldType(ContentType.DATE);
    const newField = this.newDateField();
    this.addNewFieldInCurrentSection(newField);
  }

  addCheckbox(): void {
    this.setCurrentFieldType(ContentType.BOOLEAN);
    const newField = this.newCheckboxField();
    this.addNewFieldInCurrentSection(newField);
  }

  removeElement(): void {
    //todo delete breakline by deleting twice the first character from the next field
    //todo maybe on right click i should get a list and delete it that way
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
          this.removeAtIdx(this.currentSectionIndex!, this.currentSectionFieldIndex!);
        }
      });
    }
  }

  submit(): void {
    this.displayInfo();
    const body = {
      companyId: 1,
      title: 'Title',
      description: 'Description',
      sections: this.sections
    }
    this.httpService.saveTemplate(body)
      .subscribe({
        next: result => {
          console.log(result);
        },
        error: err => {
          console.error(err);
        }
      })
  }

  onCardBodyClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const cardBody = target.closest('.card-body');

    if (cardBody === target) {
      console.log('Card body clicked, but not on a child component.');
      this.clearSectionIndex();
    }
  }

  clearSectionIndex(): void {
    this.cursorPositionInField = undefined;
    this.currentSectionIndex = undefined;
    this.currentSectionFieldIndex = undefined;
  }

  newTextField(content: string = ''): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.STRING,
      contentString: {
        id: undefined,
        value: content
      },
      contentDate: undefined,
      contentNumber: undefined,
      contentBoolean: undefined
    } as SectionField;
  }

  newNumberField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.NUMBER,
      contentString: undefined,
      contentDate: undefined,
      contentNumber: {
        id: undefined,
        value: undefined
      },
      contentBoolean: undefined
    } as SectionField;
  }

  newDateField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.DATE,
      contentString: undefined,
      contentNumber: undefined,
      contentDate: {
        id: undefined,
        value: undefined
      },
      contentBoolean: undefined
    } as SectionField;
  }

  newCheckboxField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.BOOLEAN,
      contentString: undefined,
      contentNumber: undefined,
      contentDate: undefined,
      contentBoolean: {
        id: undefined,
        value: false,
        label: ''
      }
    } as SectionField;
  }

  displayInfo(): void {
    console.log(this.sections);
  }

  addAtIdx(sectionIndex: number, fieldIndex: number, newElem: SectionField): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 0, newElem);
  }

  removeAtIdx(sectionIndex: number, fieldIndex: number): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 1);
  }

  drop(event: CdkDragDrop<SectionField[]>) {
    moveItemInArray(this.sections[this.currentSectionIndex!]!.sectionFields, event.previousIndex, event.currentIndex);
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

  setCurrentFieldType(contentType: ContentType) {
    this.currentFieldType = contentType;
  }


  /////////////////// output events //////////////////////
  setValidatorValues(event: any, contentType: ContentType): void {
    console.log(event);
    if (contentType === ContentType.STRING) {
      const currentSectionField = this.getCurrentSectionField()!;
      currentSectionField.textValidator = {
        id: currentSectionField.textValidator.id,
        isRequired: event.isRequiredCtrl,
        minSize: event.minSizeCtrl,
        maxSize: event.maxSizeCtrl,
        isEmail: event.customValidatorsCtrl.includes(TextCustomValidator.IsEmail),
        isNoSpace: event.customValidatorsCtrl.includes(TextCustomValidator.IsNoSpaces),
        isNoNumber: event.customValidatorsCtrl.includes(TextCustomValidator.IsNoNumbers),
        regex: event.regexCtrl
      };
    }
  }

  // createTemplate(): Observable<> {
  //   const templateName = this.form.controls['templateNameCtrl'].value;
  //   return this.httpService.saveTemplate({
  //     templateName,
  //     sections: this.sections
  //   });
  // }

  readonly ContentType = ContentType;
}
