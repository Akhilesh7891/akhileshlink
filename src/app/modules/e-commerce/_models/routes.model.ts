import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Routes extends BaseModel {
  id: number;
  routeCode: string;
  routeName: string;
  routeType: string;
  startLocation: string;
  endLocation: string;
  checkPoints: string;
  distance: string;
  status: number;
  /*createdAt: date;
  updatedAt: date;*/
}
