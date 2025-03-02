import {ContentType} from './ContentType';
import {StringSection} from './StringSection';
import {BooleanSection} from './BooleanSection';
import {NumberSection} from './NumberSection';

export interface SectionField {
  id: string;
  addedDate: Date;
  contentType: ContentType;
  contentString?: StringSection
  contentNumber?: NumberSection;
  contentDate?: Date;
  contentBoolean?: BooleanSection[];
}
