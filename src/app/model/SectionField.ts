import {ContentType} from './ContentType';

export interface SectionField {
  addedDate: Date;
  contentType: ContentType;
  contentString: string | null;
  contentNumber: number | null;
  contentDate: Date | null;
}
