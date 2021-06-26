import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ECommerceComponent } from './e-commerce.component';
/*import { UsersComponent } from './users/users.component';*/
import { CustomersComponent } from './customers/customers.component';

import { CompanyCustomersComponent } from './companycustomers/companycustomers.component';
import { CompanyCustomerEditComponent } from './companycustomers/companycustomer-edit/companycustomer-edit.component';

import { RolesComponent } from './roles/roles.component';
import { ProductsComponent } from './products/products.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';

import { EmployeesComponent } from './employees/employees.component';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';

import { CurrenciesComponent } from './currencies/currencies.component';
import { PaymentTermsComponent } from './paymentterms/paymentterms.component';


import { RoutesComponent } from './routes/routes.component';
/*import { RoutePlansComponent } from './routeplans/routeplans.component';*/

import { VehiclesComponent } from './vehicles/vehicles.component';

import { QuotationsComponent } from './salesquotations/quotations.component';
import { QuotationEditComponent } from './salesquotations/quotation-edit/quotation-edit.component';

import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';

import { OrdersComponent } from './salesorders/orders.component';
import { OrderEditComponent } from './salesorders/order-edit/order-edit.component';

import { ItemsComponent } from './items/items.component';

import { CashReceiptsComponent } from './cashreceipts/cashreceipts.component';

import { DeliveryItemsComponent } from './deliveryitems/deliveryitems.component';
import { DeliveryItemEditComponent } from './deliveryitems/deliveryitem-edit/deliveryitem-edit.component';

import { BankingsComponent } from './bankings/bankings.component';

import { RoutePlansComponent } from './routeplans/routeplans.component';
import { RoutePlanEditComponent } from './routeplans/routeplan-edit/routeplan-edit.component';

import { LeavesComponent } from './leaves/leaves.component';

import { LeaveRequestsComponent } from './leaverequests/leaverequests.component';

import { ExpenseTypesComponent } from './expensetypes/expensetypes.component';

import { RoutineEditComponent } from './routine/routine-edit.component';

import { CrmActivityComponent } from './crm-activity/crm-activity.component';

import { CrmCustomerComponent } from './crm-customer/crm-customer.component';

import { CustomerViewComponent } from './crm-customer/components/customer-view/customer-view.component';

const routes: Routes = [
  {
    path: '',
    component: ECommerceComponent,
    children: [
      {
        path: 'users',
        component: CustomersComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'customers',
        component: CompanyCustomersComponent,
      },
      {
        path: 'customer/add',
        component: CompanyCustomerEditComponent
      },
      {
        path: 'customer/edit',
        component: CompanyCustomerEditComponent
      },
      {
        path: 'customer/edit/:id',
        component: CompanyCustomerEditComponent
      },
      {
        path: 'employees',
        component: EmployeesComponent,
      },
      {
        path: 'employee/add',
        component: EmployeeEditComponent
      },
      {
        path: 'employee/edit/:id',
        component: EmployeeEditComponent
      },
      {
        path: 'currencies',
        component: CurrenciesComponent
      },
       {
        path: 'paymentterms',
        component: PaymentTermsComponent
      },
       {
        path: 'items',
        component: ItemsComponent
      }
      ,
       {
        path: 'salesquotations',
        component: QuotationsComponent
      },
      {
        path: 'quotation/add',
        component: QuotationEditComponent
      },
      {
        path: 'quotation/edit',
        component: QuotationEditComponent
      },
      {
        path: 'quotation/edit/:id',
        component: QuotationEditComponent
      },
       {
        path: 'salesorders',
        component: OrdersComponent
      },
      {
        path: 'salesorder/add',
        component: OrderEditComponent
      },
      {
        path: 'salesorder/edit',
        component: OrderEditComponent
      },
      {
        path: 'salesorder/edit/:id',
        component: OrderEditComponent
      },
      {
        path: 'routes',
        component: RoutesComponent
      },
      {
        path: 'vehicles',
        component: VehiclesComponent
      },
      {
        path: 'routeplans',
        component: RoutePlansComponent
      },
      {
        path: 'routeplan/add',
        component: RoutePlanEditComponent
      },
      {
        path: 'routeplan/edit',
        component: RoutePlanEditComponent
      },
      {
        path: 'routeplan/edit/:id',
        component: RoutePlanEditComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent
      },
      {
        path: 'invoice/add',
        component: InvoiceEditComponent
      },
      {
        path: 'invoice/edit',
        component: InvoiceEditComponent
      },
      {
        path: 'invoice/edit/:id',
        component: InvoiceEditComponent
      },
      {
        path: 'cashreceipts',
        component: CashReceiptsComponent
      },
      {
        path: 'deliveryitems',
        component: DeliveryItemsComponent
      },
      {
        path: 'deliveryitem/add',
        component: DeliveryItemEditComponent
      },
      {
        path: 'deliveryitem/edit',
        component: DeliveryItemEditComponent
      },
      {
        path: 'deliveryitem/edit/:id',
        component: DeliveryItemEditComponent
      },
      {
        path: 'bankings',
        component: BankingsComponent
      },
      {
        path: 'leaves',
        component: LeavesComponent
      },
      {
        path: 'leaverequests',
        component: LeaveRequestsComponent
      },
      {
        path: 'expensetypes',
        component: ExpenseTypesComponent
      },
      {
        path: 'routine',
        component: RoutineEditComponent
      },
      {
        path: 'activity',
        component: CrmActivityComponent,
      }, {
        path: 'crm-customer',
        component: CrmCustomerComponent,
      },
      {
        path: 'customer-view/:id',
        component: CustomerViewComponent
      },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECommerceRoutingModule {}
