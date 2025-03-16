import {ContentString} from './ContentString';
import {ContentNumber} from './ContentNumber';
import {ContentDate} from './ContentDate';

export interface FormSectionField {
  id: number;
  isBreakLine: boolean;
  sectionFieldId: number;
  formSectionId: number;

  contentString: ContentString;
  contentNumber: ContentNumber;
  contentDate: ContentDate;
}
