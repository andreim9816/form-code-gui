import {SectionField} from './SectionField';
import {CompanyRole} from './CompanyRole';

export interface Section {
  id: number;
  title: string;
  isValidation: boolean;
  companyRoles: CompanyRole[];
  sectionFields: SectionField[]
}
