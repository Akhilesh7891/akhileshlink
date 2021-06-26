import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CRMCustomer extends BaseModel {
id: number;
CustomerCode:string;
CustomerType :string;
CustomerName:string;
RecentActivity:Date
RecentOrder:Date;
RecentInvoice:Date;
Status:number;
}
