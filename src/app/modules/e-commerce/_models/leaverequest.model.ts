import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface LeaveRequest extends BaseModel {
  id: number;
  employeeCode: string;
  formDate: Date;
  toDate: Date;
  leaveDays: number;
  unpaiddays: number;
  remark: string;
  remarkBy: string;
  leaveCode: string;
  leaveType: string;
  leaveBalance: number;
  status: number; // Active = 0 | Inactive = 1
}
