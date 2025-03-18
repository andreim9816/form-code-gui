import {DateCustomValidator} from '../enum/DateCustomValidator';

export interface DateValidator {
  id: number;
  isRequired: boolean;
  startDate: Date;
  endDate: Date;
  dateTime: DateCustomValidator;
}
