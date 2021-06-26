import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Item extends BaseModel {
  id: number;
  itemCode: string;
  itemName: string
  description: string;
  itemGroup: string;
  salesItem: number; // yes/No
  inventory: number; // yes/no
  inStock: number;
  committed: number; // This will show Qty Ordered by Customers
  onOrder: number; // – This will show Qty Ordered from Vendors
  salesUnit: number; //Weight
  salesUoM: number; //- Weight
  salesUnitVolume: string;
  salesUoMVolume: string;
  retailPrice: string;
  wholesalePrice: string;
  noOfItems: number;  //No. of Items per Sales Unit
  itemRemarks: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  manageBatchNo: number; // [Yes/No]
  activeFrom: Date;// [Date]
  activeTo: Date; // [Date]
}
