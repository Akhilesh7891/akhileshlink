import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CustomerBilling extends BaseModel {
  id: number;
  customerId: number;
  billAddressCode: string;
  billAddress: string;
  billCity: string;
  billState: string;
  billZipCode: number;
  billCountry: string;
}
