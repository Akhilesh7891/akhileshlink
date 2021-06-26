import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Vehicle extends BaseModel {
  id: number;
  vehicleCode: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  registrationNumber: string;
  registrationValidUpTo: string
  ownerName: string;
  engineNumber: string;
  chassisNumber: string
  weightCapacity: string;
  volumeCapacity: string
  manufacturingYear: string;
  fuelCapacity: string;
  insuranceValidUpTo: string;
  pollutionValidUpTo: string;
  vehicleDocuments: string;
  status: number; // Active = 0 | Inactive = 1
}
