import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface DeliveryItem extends BaseModel {
  id: number;
  orderCode: string;
  customerCode: string;
  customerName: string
  contactPerson: string;
  mobile: number;
  status: number;
  docNo: string;
  date: Date;
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
  collectCash: string;
  amount: number;
  location: string;
}
