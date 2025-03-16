import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ContentType} from "../../model/ContentType";
import {CommonModule} from "@angular/common";
import {SectionField} from '../../model/SectionField';
import {Section} from '../../model/Section';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-text',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './text.component.html'
})
export class TextComponent {
  @Input()
  sectionField: SectionField;
  @Input()
  section: Section;
  @Input()
  sectionIndex: number;
  @Input()
  sectionFieldIndex: number;

  @Output()
  sectionData = new EventEmitter<any>();

  onKeyDown(event: Event, section: Section, sectionField: SectionField, sectionIndex: number, sectionFieldIndex: number): void {
    setTimeout(() => {
      if (sectionField.defaultValue) {
      sectionField.defaultValue = (event.target as any).value;
      this.setCursorPosition(event, section, sectionField, sectionIndex, sectionFieldIndex);
      }
    }, 0);
  }

  setCursorPosition(event: Event, section: Section, sectionField: SectionField, sectionIndex: number, sectionFieldIndex: number) {
    const target = event.target as HTMLInputElement;

    this.sectionData.emit({
      cursorPositionInField: target.selectionStart as number,
      currentSection: section,
      currentSectionField: sectionField,
      currentSectionIndex: sectionIndex,
      currentSectionFieldIndex: sectionFieldIndex
    })
  }

  onInputChange(event: any) {
    let value = event.target.value;
    this.sectionField.defaultValue = value.trim() === '' ? null : value;
  }
}
