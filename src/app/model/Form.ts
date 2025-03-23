import {FormSection} from './FormSection';

export interface Form {
  id: number;
  createdDate: Date;
  finishedDate: Date;

  currentValidationSectionId: number;
  currentSectionId: number;

  currentUserId: number;
  creatorUserId: number;

  formSections: FormSection[];
}
