import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Customer extends BaseModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userCode: string;
  gender: string;
  status: number; // Active = 0 | Inactive = 1
  dateOfBirth: string;
  type: number; // 1 = Business | 2 = Individual
  userId: number;
  password: string;
  phone: number;
  roleId: number;
}
