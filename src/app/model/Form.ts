import {FormSection} from './FormSection';
import {Template} from './Template';
import {User} from './User';

export interface Form {
  id: number;
  createdDate: Date;
  finishedDate: Date;
  lastModifiedDate: Date;

  currentValidationSectionId: number;
  currentSectionId: number;

  currentUser: User;
  creatorUser: User;

  template: Template;
  formSections: FormSection[];
}
