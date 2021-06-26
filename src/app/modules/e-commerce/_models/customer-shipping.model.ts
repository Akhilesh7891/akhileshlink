import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CustomerShipping extends BaseModel {
  id: number;
  customerId: number;
  shipAddressCode: string;
  shipAddress: string;
  shipCity: string;
  shipState: string;
  shipZipCode: number;
  shipCountry: string;
}
