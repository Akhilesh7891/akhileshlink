import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CashReceipt extends BaseModel {
  id: number;
  cashReceipt: string;
  orderCode: string;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  mobile: number;
  status: number;
  docNo: string;
  date: Date;
  location: string;
  amount: number;
  remarks: string;
}
