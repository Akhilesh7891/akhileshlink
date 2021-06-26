import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface RoutePlan extends BaseModel {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  volume: string;
  weight: number;
  routeId: number;
  vehicleId: number;
  employeeId: number;
  checkPointId: number;
  itemList: Array<any>;
}
