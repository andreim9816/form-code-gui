import {Component, Input, OnInit} from '@angular/core';
import {FormSectionField} from '../../../model/FormSectionField';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {PersonalDataType} from '../../validations/text-validator/text-validator.component';
import {StorageService} from '../../../service/StorageService';

@Component({
  selector: 'app-edit-form-text',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true,
  templateUrl: './edit-form-text.component.html'
})
export class EditFormTextComponent implements OnInit {
  @Input()
  formSectionField: FormSectionField;
  @Input()
  fieldControl!: any;
  @Input()
  submitted = false;

  constructor(private readonly storageService: StorageService) {
  }

  ngOnInit() {
    this.fieldControl.setValue(this.getDefaultValue());
  }

  isReadonlyField(): boolean {
    return this.formSectionField.sectionField.personalDataType !== null;
  }

  getDefaultValue() {
    if (this.formSectionField.contentString != null
      && this.formSectionField.contentString.value != null) {
      return this.formSectionField.contentString.value;
    }

    if (this.isReadonlyField()) {
      const user = this.storageService.getUser()!;
      // get personal data of user
      switch (this.formSectionField.sectionField.personalDataType) {
        case PersonalDataType.NAME:
          return user.lastname + ' ' + user.firstname;
        case PersonalDataType.CNP:
          return user.cnp;
        case PersonalDataType.ADDRESS: {
          return  user.address;
          // const addr = user.address;
          // const nr = addr.no != null ? 'nr. ' + addr.no + ',' : '';
          // return `str. ${addr.street}, ${nr} bl. ${addr.block}, sc. ${addr.entrance}, ap. ${addr.apartment}, ${addr.city}, ${addr.county}`;
        }
        default:
          return undefined;
      }
    } else {
      return undefined;
    }
  }
}
