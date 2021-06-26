import { CustomersTable } from './customers.table';
import { RolesTable } from './roles.table';
import { EmployeesTable } from './employees.table';
import { CarsTable } from './cars.table';
import { CompanyCustomerTable } from './companycustomers.table';
import { RemarksTable } from './remarks.table';
import { ContactsTable } from './contacts.table';

import { BillingsTable } from './billings.table';
import { ShippingsTable } from './shippings.table';
import { CurrenciesTable } from './currencies.table';

import { PaymentTermsTable } from './paymentterms.table';

import { CarSpecificationsTable } from './car-specifications.table';
import { OrdersTable } from './orders.table';
import { RoutesTable } from './routes.table';
import { RoutePlansTable } from './routeplans.table';
import { VehiclesTable } from './vehicles.table';
import { ItemsTable } from './items.table';
import { QuotationsTable } from './quotations.table';
import { InvoicesTable } from './invoices.table';
import { CashReceiptsTable } from './cashreceipts.table';
import { DeliveryItemsTable } from './deliveryitems.table';
import { BankingsTable} from './bankings.table';
import { LeavesTable } from './leaves.table';
import { LeaveRequestsTable } from './leaverequests.table';
import { ExpenseTypesTable } from './expensetypes.table';
import { RoutinesTable } from './routines.table';
import { CRMActivityTable } from './crm-activity.table';
import { CRMCustomerTable } from './crm-customer.table';

// Wrapper class
export class ECommerceDataContext {
  public static customers: any = CustomersTable.customers;

  public static cars: any = CarsTable.cars;

  public static companycustomers: any = CompanyCustomerTable.companycustomers;

  public static roles: any = RolesTable.roles;
  public static employees: any = EmployeesTable.employees;

  // e-commerce car remarks
  // one => many relations
  public static remarks = RemarksTable.remarks;

  public static customercontacts = ContactsTable.contacts;

  public static customerbillings = BillingsTable.customerbillings;

  public static customershippings = ShippingsTable.customershippings;

  public static currencies = CurrenciesTable.currencies;

  public static paymentterms = PaymentTermsTable.paymentterms;

  public static routes = RoutesTable.routes;

  public static routeplans = RoutePlansTable.routeplans;

  public static vehicles = VehiclesTable.vehicles;

  public static items = ItemsTable.items;

  public static quotations = QuotationsTable.quotations;

  public static invoices = InvoicesTable.invoices;

  public static cashreceipts = CashReceiptsTable.cashreceipts;
  
  public static carSpecs = CarSpecificationsTable.carSpecifications;

  public static deliveryitems = DeliveryItemsTable.deliveryitems;

  public static orders = OrdersTable.orders;

  public static bankings = BankingsTable.bankings; 

  public static leaves = LeavesTable.leaves;

  public static expensetypes = ExpenseTypesTable.expensetypes;

  public static routines = RoutinesTable.routines;

  public static leaverequests = LeaveRequestsTable.leaverequests;

  public static crmActivity = CRMActivityTable.crmActivity;
  
  public static crmCustomer = CRMCustomerTable.crmCustomer;
}
