import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Quotation extends BaseModel {
  id: number;
  customerCode: string;
  customerName: string
  contactPerson: string;
  mobile: number;
  status: number;
  docNo: string;
  date: Date;
  payTerms: string;
  currency: string;
  approval: string; //Droft/Approved
  itemList: Array<any>;
  billAddressCode: string;
  billAddress: string;
  billCity: string;
  billState: string;
  billZipCode: number;
  billCountry: string;
  shipAddressCode: string;
  shipAddress: string;
  shipCity: string;
  shipState: string;
  shipZipCode: number;
  shipCountry: string;
  remarks: string;
  totalDiscount: number;
}
