import {SectionField} from './SectionField';

export interface Section {
  id: number;
  content: string;
  sectionFields: SectionField[]
}
