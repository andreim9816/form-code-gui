import {ContentType} from './ContentType';
import {TextValidator} from './TextValidator';
import {NumberValidator} from './NumberValidator';
import {DateValidator} from './DateValidator';

export interface SectionField {
  id: string;
  addedDate: Date;
  defaultValue: string | null;

  contentType: ContentType;

  textValidator?: TextValidator;
  numberValidator?: NumberValidator;
  dateValidator?: DateValidator;
}
