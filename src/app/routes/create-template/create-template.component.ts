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
import {CurrentFieldType} from '../../enum/current-field-type';

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

  ],
  templateUrl: './create-template.component.html'
})
export class CreateTemplateComponent implements OnInit, AfterViewChecked {
  readonly BREAK_LINE = 'BREAKLINE';
  currentFieldType: CurrentFieldType;
  form: FormGroup;
  sections: Section[] = [];

  cursorPositionInField: number | null;

  currentSectionIndex: number | null;
  currentSectionFieldIndex: number | null;

  mockData = true;
  viewChecked = false;

  constructor(private readonly fb: FormBuilder) {
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
              id: '123',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 8,
                value: 'abcdefghijkl'
              }
            },
            {
              id: '456',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 7,
                value: 'mno'
              }
            },
            {
              id: '91011',
              contentType: ContentType.STRING,
              contentString: {
                id: 6,
                value: this.BREAK_LINE
              }
            },
            {
              id: '789',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 5,
                value: 'pqrstuvwxyz'
              }
            }
          ]
        },
        {
          sectionFields: [
            {
              id: '10',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 2,
                value: 'xyz'
              }
            },
            {
              id: '11',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 3,
                value: 'tuv'
              }
            },
            {
              id: '12',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: {
                id: 4,
                value: 'ciolacu'
              }
            }
          ]
        },
        {
          sectionFields: [
            {
              id: '9101112',
              contentType: ContentType.STRING,
              contentString: {
                id: 1,
                value: 'content'
              }
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

  addNewSection(): void {
    const newSection = {
      content: '',
      sectionFields: [this.newTextField()]
    } as Section;

    this.sections.push(newSection);
  }

  addNumber(): void {
    if (
      this.getCurrentSectionField()?.contentType === ContentType.STRING
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {
      this.setCurrentFieldType(CurrentFieldType.NUMBER);
      const contentInFieldBefore = this.getCurrentSectionField()?.contentString?.value.slice(0, this.cursorPositionInField) ?? '';
      const contentInFieldAfter = this.getCurrentSectionField()?.contentString?.value.slice(this.cursorPositionInField) ?? '';

      const newField = this.newNumberField();
      const fieldBefore = this.newTextField(contentInFieldBefore);
      const fieldAfter = this.newTextField(contentInFieldAfter);

      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);

      if ((fieldBefore.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, fieldBefore);
      }

      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, newField);

      if ((fieldAfter.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, fieldAfter);
      }

      this.cursorPositionInField = 0;
      this.viewChecked = true;
    }
  }

  addText(): void {
    if (
      this.getCurrentSectionField()?.contentType === ContentType.STRING
      && this.getCurrentSectionField()?.contentString?.value !== ''
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {
      this.setCurrentFieldType(CurrentFieldType.TEXT);
      const contentInFieldBefore = this.getCurrentSectionField()?.contentString?.value.slice(0, this.cursorPositionInField) ?? '';
      const contentInFieldAfter = this.getCurrentSectionField()?.contentString?.value.slice(this.cursorPositionInField) ?? '';

      const newField = this.newTextField();
      const fieldBefore = this.newTextField(contentInFieldBefore);
      const fieldAfter = this.newTextField(contentInFieldAfter);

      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);

      if ((fieldBefore.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, fieldBefore);
      }

      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, newField);

      if ((fieldAfter.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, fieldAfter);
      }

      this.cursorPositionInField = 0;
      this.viewChecked = true;
    }
  }

  addNewBreakLine(): void {
    if (
      this.getCurrentSectionField()?.contentString?.value !== ''
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {
      this.setCurrentFieldType(CurrentFieldType.BREAK_LINE);
      const contentInFieldBefore = this.getCurrentSectionField()?.contentString?.value.slice(0, this.cursorPositionInField) ?? '';
      const contentInFieldAfter = this.getCurrentSectionField()?.contentString?.value.slice(this.cursorPositionInField) ?? '';

      const newField = this.newTextField(this.BREAK_LINE);
      const fieldBefore = this.newTextField(contentInFieldBefore);
      const fieldAfter = this.newTextField(contentInFieldAfter);

      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);

      if ((fieldBefore.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, fieldBefore);
      }

      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, newField);

      if ((fieldAfter.contentString?.value ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, fieldAfter);
      }

      this.cursorPositionInField = 0;
      this.clearPositions();
      this.viewChecked = true;
    }
  }

  submit(): void {
  }

  clearPositions(): void {
    this.cursorPositionInField = null;
    this.currentSectionIndex = null;
    this.currentSectionFieldIndex = null;
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

  show(): void {
    console.log(this.sections);
  }

  addAtIdx(sectionIndex: number, fieldIndex: number, newElem: SectionField): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 0, newElem);
  }

  removeAtIdx(sectionIndex: number, fieldIndex: number): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 1);
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

  setCurrentFieldType(currentFieldType: CurrentFieldType) {
    this.currentFieldType = currentFieldType;
  }

  readonly ContentType = ContentType;
  protected readonly CurrentFieldType = CurrentFieldType;
}
