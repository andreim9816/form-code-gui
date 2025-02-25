import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Section} from '../../model/Section';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {SectionField} from '../../model/SectionField';
import {ContentType} from '../../model/ContentType';
import {TextComponent} from '../../shared/text/text.component';

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
  ],
  templateUrl: './create-template.component.html'
})
export class CreateTemplateComponent implements OnInit {

  form: FormGroup;
  sections: Section[] = [];

  @Input()
  cursorPositionInField: number | null;

  currentSectionIndex: number | null;
  currentSectionFieldIndex: number | null;

  currentSection: Section | null;
  currentSectionField: SectionField | null;

  mockData = true;

  constructor(
    private readonly fb: FormBuilder) {
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
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'abcdefghijkl'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'mno'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'pqrstuvwxyz'
            }
          ]
        },
        {
          sectionFields: [
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'xyz'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'tuv'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'ciolacu'
            }
          ]
        },
      ] as Section[];
    }
  }

  addNewSection(): void {
    const newSection = {
      content: '',
      sectionFields: [this.newTextField()]
    } as Section;

    this.sections.push(newSection);
  }

  addText(): void {
    if (
      this.currentSectionField?.contentType === ContentType.STRING
      && this.currentSectionIndex != null
      && this.currentSectionFieldIndex != null
      && this.cursorPositionInField != null
    ) {

      const contentInNewField = this.currentSectionField.contentString?.slice(this.cursorPositionInField) ?? '';

      const newSectionField = this.newTextField(contentInNewField);

      // new elem
      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex + 1, newSectionField);

      // delete and add again
      const replacedSectionField = this.newTextField(this.currentSectionField.contentString?.slice(0, this.cursorPositionInField) ?? '');
      this.removeAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex);
      this.addAtIdx(this.currentSectionIndex, this.currentSectionFieldIndex, replacedSectionField);

      this.cursorPositionInField = null;
      this.currentSectionIndex = null;
      this.currentSectionFieldIndex = null;
      this.currentSection = null;
      this.currentSectionField = null;
    }
  }

  submit(): void {
  }

  newTextField(content: string = ''): SectionField {
    return {
      addedDate: new Date(),
      contentType: ContentType.STRING,
      contentString: content,
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
