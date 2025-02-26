import {ContentType} from './ContentType';

export interface SectionField {
  id: string;
  addedDate: Date;
  contentType: ContentType;
  contentString: string | null;
  contentNumber: number | null;
  contentDate: Date | null;
}
