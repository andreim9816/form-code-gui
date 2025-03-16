import {FormSectionStatus} from '../enum/FormSectionStatus';
import {FormSectionField} from './FormSectionField';
import {SectionLiteDto} from './SectionLiteDto';

export interface FormSection {
  id: number;
  status: FormSectionStatus;
  section: SectionLiteDto;
  formSectionFields: FormSectionField[];
}
