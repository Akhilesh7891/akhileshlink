import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Currency extends BaseModel {
  id: number;
  name: string;
  currencyCode: string;
  currencySign: string;
  decimalPlace: string;
  status: number; // Active = 0 | Inactive = 1
}
