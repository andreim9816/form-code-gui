export interface TextValidator {
  id: number;
  isRequired: boolean;
  minSize: number;
  maxSize: number;
  isEmail: boolean;
  isNoSpace: boolean;
  isNoNumber: boolean;
  regex: string;
}
