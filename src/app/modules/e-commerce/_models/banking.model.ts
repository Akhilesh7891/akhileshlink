import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Banking extends BaseModel {
  id: number;
  employeeCode: string;
  employeeName: string;
  docNo: string;
  date: Date;
  location: string;
  amountDeposit: number;
  depositDate: Date;
  bankBranch: string;
  remarks: string;
  employeeSignature: string;
}
