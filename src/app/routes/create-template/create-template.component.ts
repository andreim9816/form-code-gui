import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Section} from '../../model/Section';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {SectionField} from '../../model/SectionField';
import {ContentType} from '../../model/ContentType';
import {AutoExpandDirective} from '../../directive/auto-expand.directive';

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
    AutoExpandDirective,
  ],
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

  form: FormGroup;
  sections: Section[] = [];
  cursorPosition: number;
  currentSectionPosition: number;
  currentSectionFieldPosition: number;
  currentSection: Section;
  currentSectionField: SectionField;

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
              contentString: 'abcdef'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'ghijkl'
            },
            {
              addedDate: new Date(),
              contentType: ContentType.STRING,
              contentString: 'mn'
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
    if (this.currentSectionField.contentType === ContentType.STRING) {
      const contentInTheNewField = this.currentSectionField.contentString?.slice(this.cursorPosition) ?? '';

      const newSectionField = this.newTextField(contentInTheNewField);

      // new elem
      this.addAtIdx(this.currentSectionPosition, this.currentSectionFieldPosition + 1, newSectionField);

      // delete and add again
      const replacedSectionField = this.newTextField(this.currentSectionField.contentString?.slice(0, this.cursorPosition) ?? '');
      this.removeAtIdx(this.currentSectionPosition, this.currentSectionFieldPosition);
      this.addAtIdx(this.currentSectionPosition, this.currentSectionFieldPosition, replacedSectionField);
    }
  }

  onKeyDown(event: Event, section: Section, sectionField: SectionField, sectionIndex: number, sectionFieldIndex: number): void {
    setTimeout(() => {
      sectionField.contentString = (event.target as any).value;
      this.setCursorPosition(event, section, sectionField, sectionIndex, sectionFieldIndex);
    }, 0);
  }

  setCursorPosition(event: Event, section: Section, sectionField: SectionField, sectionIndex: number, sectionFieldIndex: number) {
    if (sectionField.contentType === ContentType.STRING) {
      const target = event.target as HTMLInputElement;
      this.cursorPosition = target.selectionStart as number;
      this.currentSection = section;
      this.currentSectionField = sectionField;
      this.currentSectionPosition = sectionIndex;
      this.currentSectionFieldPosition = sectionFieldIndex;
    }
  }

  submit(): void {
  }

  addAtIdx(sectionIndex: number, fieldIndex: number, newElem: SectionField): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 0, newElem);
  }

  removeAtIdx(sectionIndex: number, fieldIndex: number): void {
    this.sections[sectionIndex].sectionFields.splice(fieldIndex, 1);
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

  protected readonly ContentType = ContentType;
}
