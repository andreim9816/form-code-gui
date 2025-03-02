import {ContentType} from './ContentType';
import {StringSection} from './StringSection';
import {BooleanSection} from './BooleanSection';
import {NumberSection} from './NumberSection';
import {DateSection} from './DateSection';

export interface SectionField {
  id: string;
  addedDate: Date;
  contentType: ContentType;
  contentString?: StringSection
  contentNumber?: NumberSection;
  contentDate?: DateSection;
  contentBoolean?: BooleanSection[];
}
