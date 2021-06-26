import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CompanyCustomer extends BaseModel {
  id: number;
  customerCode: string;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  designation: string;
  customerGroup: string;
  currency: string;
  salesEmployee: string;
  sapCustomer: string;
}
