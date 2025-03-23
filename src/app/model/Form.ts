import {FormSection} from './FormSection';
import {Template} from './Template';

export interface Form {
  id: number;
  createdDate: Date;
  finishedDate: Date;

  currentValidationSectionId: number;
  currentSectionId: number;

  currentUserId: number;
  creatorUserId: number;

  template: Template;
  formSections: FormSection[];
}
