import {ContentString} from './ContentString';
import {ContentNumber} from './ContentNumber';
import {ContentDate} from './ContentDate';
import {SectionField} from './SectionField';
import {ContentFile} from './ContentFile';

export interface FormSectionField {
  id: number;
  isBreakLine: boolean;
  sectionField: SectionField;
  formSectionId: number;

  contentString: ContentString;
  contentNumber: ContentNumber;
  contentDate: ContentDate;
  contentFile: ContentFile;
}
