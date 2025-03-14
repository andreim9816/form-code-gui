import {SectionField} from './SectionField';

export interface Section {
  id: number;
  title: string;
  isValidation: boolean;
  sectionFields: SectionField[]
}
