import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface PaymentTerm extends BaseModel {
  id: number;
  paymentTermCode: string;
  paymentTerm: string;
  description: string;
  days: number;
  status: number; // Active = 0 | Inactive = 1
}
