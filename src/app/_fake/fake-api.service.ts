import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { UsersTable } from './fake-db/users.table';
import { CarsTable } from './fake-db/cars.table';
// ECommerce
import { ECommerceDataContext } from '../modules/e-commerce/_fake/fake-server/_e-commerce.data-context';

@Injectable({
  providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
  constructor() { }

  /**
   * Create Fake DB and API
   */
  createDb(): {} | Observable<{}> {
    // tslint:disable-next-line:class-name
    const db = {
      // auth module
      users: UsersTable.users,

      // data-table
      cars: CarsTable.cars,

      customers: ECommerceDataContext.customers,
      roles: ECommerceDataContext.roles,
      employees: ECommerceDataContext.employees,
      // products
      companycustomers: ECommerceDataContext.companycustomers,
      //products: ECommerceDataContext.cars,
      productRemarks: ECommerceDataContext.remarks,
      productSpecs: ECommerceDataContext.carSpecs,

      customercontacts: ECommerceDataContext.customercontacts,

      customerbillings: ECommerceDataContext.customerbillings,

      customershippings: ECommerceDataContext.customershippings,

      currencies: ECommerceDataContext.currencies,

      paymentterms: ECommerceDataContext.paymentterms,

      routes: ECommerceDataContext.routes,

      routeplans: ECommerceDataContext.routeplans,

      vehicles: ECommerceDataContext.vehicles,

      items: ECommerceDataContext.items,

      quotations: ECommerceDataContext.quotations,

      invoices: ECommerceDataContext.invoices,

      cashreceipts: ECommerceDataContext.cashreceipts,

      deliveryitems: ECommerceDataContext.deliveryitems,

      bankings: ECommerceDataContext.bankings,

      orders: ECommerceDataContext.orders,

      leaves: ECommerceDataContext.leaves,

      leaverequests: ECommerceDataContext.leaverequests,

      expensetypes: ECommerceDataContext.expensetypes,

      routines: ECommerceDataContext.routines,

      crmActivity: ECommerceDataContext.crmActivity,
      
      crmCustomer: ECommerceDataContext.crmCustomer,

    };
    return db;
  }
}
