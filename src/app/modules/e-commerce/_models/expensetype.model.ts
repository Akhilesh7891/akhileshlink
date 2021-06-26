import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ExpenseType extends BaseModel {
  id: number;
  expenseTypeCode: string;
  leaveCode: string;
  status: number; // Active = 0 | Inactive = 1
}
