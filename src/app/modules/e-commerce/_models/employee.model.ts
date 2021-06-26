import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Employee extends BaseModel {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  designation: string;
  department: string;
  status: number;
  gender: number;
  fatherName: string;
  bloodGroup: string;
  DOB: string;
  branch: string;
  cashLimit: string;
  citizenship: string;
  dlNumber: string;
  dlExpiryDate: string;
  passportNo: string;
  passportExpiryDate: string;
  firstGovIDNo: string;
  secondGovIDNo: string;
  thirdGovIDNo: string;
  firstGovIDType: string;
  secondGovIDType: string;
  thirdGovIDType: string;
  workAddress: string;
  workCity: string;
  workState: string;
  workZip: number;
  workCountry: string;
  workPhone: number;
  workMobile: number;
  workEmailID: string;
  homeAddress: string;
  homeCity: string;
  homeState: string;
  homeZip: number;
  homeCountry: string;
  homePhone: number;
  homeMobile: number,
  homeEmail: string,
  IMEICode1: string;
  IMEICode2: string;
}
