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
  ],
  templateUrl: './create-template.component.html'
})
export class CreateTemplateComponent implements OnInit, AfterViewChecked {

  form: FormGroup;
  sections: Section[] = [];

  cursorPositionInField: number | null;

  currentSectionIndex: number | null;
  currentSectionFieldIndex: number | null;

  currentSection: Section | null;
  currentSectionField: SectionField | null;

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
              contentString: 'abcdefghijkl'
            },
            {
              id: '456',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'mno'
            },
            {
              id: '789',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'pqrstuvwxyz'
            }
          ]
        },
        {
          sectionFields: [
            {
              id: '10',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'xyz'
            },
            {
              id: '11',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'tuv'
            },
            {
              id: '12',
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'ciolacu'
            }
          ]
        },
      ] as Section[];
    }
  }

  ngAfterViewChecked() {
    if (this.viewChecked && this.currentSectionField) {
      const htmlElement = document.getElementById('' + this.currentSectionField.id) as HTMLElement;
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
      this.currentSectionField?.contentType === ContentType.STRING
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {
      const contentInFieldBefore = this.currentSectionField.contentString?.slice(0, this.cursorPositionInField) ?? '';
      const contentInFieldAfter = this.currentSectionField.contentString?.slice(this.cursorPositionInField) ?? '';

      const newField = this.newNumberField();
      const fieldBefore = this.newTextField(contentInFieldBefore);
      const fieldAfter = this.newTextField(contentInFieldAfter);

      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);

      if ((fieldBefore.contentString ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, fieldBefore);
      }

      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, newField);

      if ((fieldAfter.contentString ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, fieldAfter);
      }

      this.cursorPositionInField = 0;
      this.currentSectionField = newField;
      this.viewChecked = true;
    }
  }

  addText(): void {
    if (
      this.currentSectionField?.contentType === ContentType.STRING
      && this.currentSectionField.contentString !== ''
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {
      const contentInFieldBefore = this.currentSectionField.contentString?.slice(0, this.cursorPositionInField) ?? '';
      const contentInFieldAfter = this.currentSectionField.contentString?.slice(this.cursorPositionInField) ?? '';

      const newField = this.newTextField();
      const fieldBefore = this.newTextField(contentInFieldBefore);
      const fieldAfter = this.newTextField(contentInFieldAfter);

      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);

      if ((fieldBefore.contentString ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, fieldBefore);
      }

      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex++, newField);

      if ((fieldAfter.contentString ?? '').length > 0) {
        this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, fieldAfter);
      }

      this.cursorPositionInField = 0;
      this.currentSectionField = newField;
      this.viewChecked = true;
    }
  }

  submit(): void {
  }

  clearPositions(): void {
    this.cursorPositionInField = null;
    this.currentSectionIndex = null;
    this.currentSectionFieldIndex = null;
    this.currentSection = null;
    this.currentSectionField = null;
  }

  newTextField(content: string = ''): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.STRING,
      contentString: content,
      contentDate: null,
      contentNumber: null
    } as SectionField;
  }

  newNumberField(): SectionField {
    return {
      id: HtmlUtils.generateUUID(),
      addedDate: new Date(),
      contentType: ContentType.NUMBER,
      contentString: null,
      contentDate: null,
      contentNumber: null
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
    this.currentSection = event.currentSection;
    this.currentSectionField = event.currentSectionField;
    this.currentSectionIndex = event.currentSectionIndex;
    this.currentSectionFieldIndex = event.currentSectionFieldIndex;
  }

  readonly ContentType = ContentType;
}
