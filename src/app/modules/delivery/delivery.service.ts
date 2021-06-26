import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../_metronic/shared/crud-table';
import { Delivery } from './model/delivery.model';
import { environment } from '../../../environments/environment';
import { Observable, from, BehaviorSubject, Subject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends TableService<Delivery> implements OnDestroy {

  
  deliveryId = new Subject();

  private deliveryData: any[] = [
    {
      id: 1,
      DeliveryPlanCode: 'PAT001112',
      VehicleCode: 'Payment term',
      DriverEmployeeCode: 'Tesrtstrstts',
      SaleEmployeeCode: 'Tesrtstrstts',
      RouteCode: 1,
      status: 0      
    },
    {
      id: 2,
      DeliveryPlanCode: 'PAT001113',
      VehicleCode: 'Delivery term',
      DriverEmployeeCode: 'Tesrtstrstts',
      SaleEmployeeCode: 'Tesrtstrstts',
      RouteCode: 2,
      status: 1 
    }
  ]

  private deliveryLoadingData: any[] = [
    {
      id: 1,
      DeliveryPlanCode: 'PAT001112',
      VehicleCode: 'Payment term',
      DriverEmployeeCode: 'Tesrtstrstts',
      SaleEmployeeCode: 'Tesrtstrstts',
      RouteCode: 1,
      status: 0      
    },
    {
      id: 2,
      DeliveryPlanCode: 'PAT001113',
      VehicleCode: 'Delivery term',
      DriverEmployeeCode: 'Tesrtstrstts',
      SaleEmployeeCode: 'Tesrtstrstts',
      RouteCode: 2,
      status: 1 
    }
  ]

  private deliveryModalData: any[] = [
    {
      id: 1,
      DeliveryPlanCode: 'PAT001112',
      SalesOrderCode: 'Payment term',
      CheckpointCode: 'Tesrtstrstts',
      CustomerCode: 'Tesrtstrstts',
      CustomerName: 'Abhay',
      CustomersShippingAddress:'Gurugram',
      DeliveryDueDate:'12/08/2021',
      status: 0      
    },
    {
      id: 2,
      DeliveryPlanCode: 'PAT001113',
      SalesOrderCode: 'Payment term',
      CheckpointCode: 'Tesrtstrstts',
      CustomerCode: 'Tesrtstrstts',
      CustomerName: 'Abhay',
      CustomersShippingAddress:'Gurugram',
      DeliveryDueDate:'12/08/2021',
      status: 1 
    },
    {
      id: 3,
      DeliveryPlanCode: 'PAT001112',
      SalesOrderCode: 'Payment term',
      CheckpointCode: 'Tesrtstrstts',
      CustomerCode: 'Tesrtstrstts',
      CustomerName: 'Abhay',
      CustomersShippingAddress:'Gurugram',
      DeliveryDueDate:'12/08/2021',
      status: 0      
    },
    {
      id: 4,
      DeliveryPlanCode: 'PAT001113',
      SalesOrderCode: 'Payment term',
      CheckpointCode: 'Tesrtstrstts',
      CustomerCode: 'Tesrtstrstts',
      CustomerName: 'Abhay',
      CustomersShippingAddress:'Gurugram',
      DeliveryDueDate:'12/08/2021',
      status: 1 
    }
  ]

  private additionalModalData: any[] = [
    {
      id: 1,
      DeliveryPlanCode: 'PAT001112',
      ItemCode: 'Payment term',
      ItemName: 'Tesrtstrstts',
      Quantity: '3',
      Unit: '4',
      status: 0      
    },
    {
      id: 2,
      DeliveryPlanCode: 'PAT001113',
      ItemCode: 'Payment term',
      ItemName: 'Tesrtstrstts',
      Quantity: '3',
      Unit: '4',
      status: 1 
    },
    {
      id: 3,
      DeliveryPlanCode: 'PAT001112',
      ItemCode: 'Payment term',
      ItemName: 'Tesrtstrstts',
      Quantity: '3',
      Unit: '4',
      status: 0      
    },
    {
      id: 4,
      DeliveryPlanCode: 'PAT001113',
      ItemCode: 'Payment term',
      ItemName: 'Tesrtstrstts',
      Quantity: '3',
      Unit: '4',
      status: 1  
    }
  ]

  getDeliveryData(): Observable<any[]> {
    return from([this.deliveryData])
  }

  getDeliveryLoadingData(): Observable<any[]> {
    return from([this.deliveryLoadingData])
  }

  getDeliveryModalData(): Observable<any[]> {
    return from([this.deliveryModalData])
  }
  
  getadditionalModalData(): Observable<any[]> {
    return from([this.additionalModalData])
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  
  
}

