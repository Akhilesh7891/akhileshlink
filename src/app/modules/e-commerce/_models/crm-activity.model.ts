import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CRMActivity extends BaseModel {
id: number;
ActivityCode:string;
ActivityDate:Date
ActivityType :string;
AssignTo:string;
StartDate:Date;
Subject:string;
MeetingLocation:string;
Remark:string;
Attachment:string;
CustomerCode:string;
CustomerName:string;
ContactPerson:string;
MobileNumber:number;
EndDate:Date;
Status:number;


}
