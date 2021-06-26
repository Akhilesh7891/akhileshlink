import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CustomerContact extends BaseModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  customerId: number;
}
