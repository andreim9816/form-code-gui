import {Component, Input} from '@angular/core';
import {SectionField} from '../../model/SectionField';
import {FormsModule} from '@angular/forms';
import {CreateStep} from '../../enum/CreateStep';

@Component({
  selector: 'app-number',
  imports: [
    FormsModule
  ],
  templateUrl: './number.component.html'
})
export class NumberComponent {
  @Input()
  sectionField: SectionField;
  @Input()
  step: CreateStep = CreateStep.CREATE_TEMPLATE;
  readonly CreateFormStep = CreateStep;
  readonly Number = Number;

  // get sectionFieldValue() {
  //   return this.step === CreateStep.CREATE_FORM
  //     ? this.sectionField.defaultValue
  //     : this.sectionField.contentNumber!.value;
  // }
  //
  // set sectionFieldValue(val: any) {
  //   if (this.step === CreateStep.CREATE_FORM) {
  //     this.sectionField.defaultValue = val.toString();
  //   } else if (this.sectionField.contentNumber) {
  //     this.sectionField.contentNumber.value = val;
  //   }
  // }

  isReadonly(): boolean {
    // if (this.step === CreateStep.CREATE_TEMPLATE) {
      return false;
    // }

      // && this.sectionField.defaultValue !== null
      // && this.sectionField.defaultValue !== undefined;
  }
}
