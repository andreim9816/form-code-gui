import {ContentType} from './ContentType';
import {TextValidator} from './TextValidator';
import {NumberValidator} from './NumberValidator';
import {DateValidator} from './DateValidator';
import {PersonalDataType} from '../routes/validations/text-validator/text-validator.component';

export interface SectionField {
  id: string;
  addedDate: Date;
  defaultValue: string | null;
  personalDataType: PersonalDataType | null;
  contentType: ContentType;

  textValidator?: TextValidator;
  numberValidator?: NumberValidator;
  dateValidator?: DateValidator;
}
