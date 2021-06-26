import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Role extends BaseModel {
  id: number;
  roleName: string;
  status: number; // Active = 0 | Inactive = 1
}
