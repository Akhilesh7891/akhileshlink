import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Leave extends BaseModel {
  id: number;
  leaveCode: string;
  leaveType: string;
  leaveBalance: number;
  status: number; // Active = 0 | Inactive = 1
}
