import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
/*import { UsersComponent } from './users/users.component';
import { DeleteUserModalComponent } from './users/components/delete-user-modal/delete-user-modal.component';
import { DeleteUsersModalComponent } from './users/components/delete-users-modal/delete-users-modal.component';
import { FetchUsersModalComponent } from './users/components/fetch-users-modal/fetch-users-modal.component';
import { UpdateUsersStatusModalComponent } from './users/components/update-users-status-modal/update-users-status-modal.component';
import { EditUserModalComponent } from './users/components/edit-user-modal/edit-user-modal.component';
*/

import { RolesComponent } from './roles/roles.component';
import { DeleteRoleModalComponent } from './roles/components/delete-role-modal/delete-role-modal.component';
import { EditRoleModalComponent } from './roles/components/edit-role-modal/edit-role-modal.component';

import { EmployeesComponent } from './employees/employees.component';
import { EmployeeEditComponent } from './employees/employee-edit/employee-edit.component';
import { DeleteEmployeeModalComponent } from './employees/delete-employee-modal/delete-employee-modal.component';

import { CompanyCustomersComponent } from './companycustomers/companycustomers.component';
import { CompanyCustomerEditComponent } from './companycustomers/companycustomer-edit/companycustomer-edit.component';
import { DeleteCompanyCustomerModalComponent } from './companycustomers/delete-companycustomer-modal/delete-companycustomer-modal.component';

import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { ECommerceComponent } from './e-commerce.component';
import { ECommerceRoutingModule } from './e-commerce-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteCustomerModalComponent } from './customers/components/delete-customer-modal/delete-customer-modal.component';
import { DeleteCustomersModalComponent } from './customers/components/delete-customers-modal/delete-customers-modal.component';
import { FetchCustomersModalComponent } from './customers/components/fetch-customers-modal/fetch-customers-modal.component';
import { UpdateCustomersStatusModalComponent } from './customers/components/update-customers-status-modal/update-customers-status-modal.component';
import { EditCustomerModalComponent } from './customers/components/edit-customer-modal/edit-customer-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductModalComponent } from './products/components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from './products/components/delete-products-modal/delete-products-modal.component';
import { UpdateProductsStatusModalComponent } from './products/components/update-products-status-modal/update-products-status-modal.component';
import { FetchProductsModalComponent } from './products/components/fetch-products-modal/fetch-products-modal.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { RemarksComponent } from './products/product-edit/remarks/remarks.component';
import { SpecificationsComponent } from './products/product-edit/specifications/specifications.component';
import { DeleteRemarkModalComponent } from './products/product-edit/remarks/delete-remark-modal/delete-remark-modal.component';
import { DeleteRemarksModalComponent } from './products/product-edit/remarks/delete-remarks-modal/delete-remarks-modal.component';
import { FetchRemarksModalComponent } from './products/product-edit/remarks/fetch-remarks-modal/fetch-remarks-modal.component';
import { DeleteSpecModalComponent } from './products/product-edit/specifications/delete-spec-modal/delete-spec-modal.component';
import { DeleteSpecsModalComponent } from './products/product-edit/specifications/delete-specs-modal/delete-specs-modal.component';
import { FetchSpecsModalComponent } from './products/product-edit/specifications/fetch-specs-modal/fetch-specs-modal.component';
import { EditRemarkModalComponent } from './products/product-edit/remarks/edit-remark-modal/edit-remark-modal.component';
import { EditSpecModalComponent } from './products/product-edit/specifications/edit-spec-modal/edit-spec-modal.component';

import { ContactsComponent } from './companycustomers/companycustomer-edit/contacts/contacts.component';
import { DeleteContactModalComponent, } from './companycustomers/companycustomer-edit/contacts/delete-contact-modal/delete-contact-modal.component';
import { EditContactModalComponent } from './companycustomers/companycustomer-edit/contacts/edit-contact-modal/edit-contact-modal.component';

import { ShippingsComponent } from './companycustomers/companycustomer-edit/shippings/shippings.component';
import { DeleteShippingModalComponent, } from './companycustomers/companycustomer-edit/shippings/delete-shipping-modal/delete-shipping-modal.component';
import { EditShippingModalComponent } from './companycustomers/companycustomer-edit/shippings/edit-shipping-modal/edit-shipping-modal.component';

import { BillingsComponent } from './companycustomers/companycustomer-edit/billings/billings.component';
import { DeleteBillingModalComponent, } from './companycustomers/companycustomer-edit/billings/delete-billing-modal/delete-billing-modal.component';
import { EditBillingModalComponent } from './companycustomers/companycustomer-edit/billings/edit-billing-modal/edit-billing-modal.component';


import { CurrenciesComponent } from './currencies/currencies.component';
import { DeleteCurrencyModalComponent } from './currencies/components/delete-currency-modal/delete-currency-modal.component';
import { EditCurrencyModalComponent } from './currencies/components/edit-currency-modal/edit-currency-modal.component';

import { PaymentTermsComponent } from './paymentterms/paymentterms.component';
import { DeletePaymentTermModalComponent } from './paymentterms/components/delete-paymentterm-modal/delete-paymentterm-modal.component';
import { EditPaymentTermModalComponent } from './paymentterms/components/edit-paymentterm-modal/edit-paymentterm-modal.component';

import { RoutesComponent } from './routes/routes.component';
import { DeleteRoutesModalComponent } from './routes/components/delete-routes-modal/delete-routes-modal.component';
import { EditRoutesModalComponent } from './routes/components/edit-routes-modal/edit-routes-modal.component';

import { VehiclesComponent } from './vehicles/vehicles.component';
import { DeleteVehicleModalComponent } from './vehicles/components/delete-vehicle-modal/delete-vehicle-modal.component';
import { EditVehicleModalComponent } from './vehicles/components/edit-vehicle-modal/edit-vehicle-modal.component';

import { ItemsComponent } from './items/items.component';
import { ViewItemModalComponent } from './items/components/view-item-modal/view-item-modal.component';

import { QuotationsComponent } from './salesquotations/quotations.component';
import { DeleteQuotationModalComponent } from './salesquotations/delete-quotation-modal/delete-quotation-modal.component';
import { QuotationEditComponent } from './salesquotations/quotation-edit/quotation-edit.component';

import { OrdersComponent } from './salesorders/orders.component';
import { DeleteOrderModalComponent } from './salesorders/delete-order-modal/delete-order-modal.component';
import { OrderEditComponent } from './salesorders/order-edit/order-edit.component';

import { InvoicesComponent } from './invoices/invoices.component';
import { DeleteInvoiceModalComponent } from './invoices/delete-invoice-modal/delete-invoice-modal.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';

import { CashReceiptsComponent } from './cashreceipts/cashreceipts.component';
import { DeleteCashReceiptModalComponent } from './cashreceipts/components/delete-cashreceipt-modal/delete-cashreceipt-modal.component';
import { EditCashReceiptModalComponent } from './cashreceipts/components/edit-cashreceipt-modal/edit-cashreceipt-modal.component';

import { DeliveryItemsComponent } from './deliveryitems/deliveryitems.component';
import { DeleteDeliveryItemModalComponent } from './deliveryitems/delete-deliveryitem-modal/delete-deliveryitem-modal.component';
import { DeliveryItemEditComponent } from './deliveryitems/deliveryitem-edit/deliveryitem-edit.component';

import { BankingsComponent } from './bankings/bankings.component';
import { DeleteBankingModalComponent } from './bankings/components/delete-banking-modal/delete-banking-modal.component';
import { EditBankingModalComponent } from './bankings/components/edit-banking-modal/edit-banking-modal.component';

import { RoutePlansComponent } from './routeplans/routeplans.component';
import { DeleteRoutePlanModalComponent } from './routeplans/delete-routeplan-modal/delete-routeplan-modal.component';
import { RoutePlanEditComponent } from './routeplans/routeplan-edit/routeplan-edit.component';

import { LeavesComponent } from './leaves/leaves.component';
import { DeleteLeaveModalComponent } from './leaves/components/delete-leave-modal/delete-leave-modal.component';
import { EditLeaveModalComponent } from './leaves/components/edit-leave-modal/edit-leave-modal.component';

import { LeaveRequestsComponent } from './leaverequests/leaverequests.component';
import { DeleteLeaveRequestModalComponent } from './leaverequests/components/delete-leaverequest-modal/delete-leaverequest-modal.component';
import { EditLeaveRequestModalComponent } from './leaverequests/components/edit-leaverequest-modal/edit-leaverequest-modal.component';

import { ExpenseTypesComponent } from './expensetypes/expensetypes.component';
import { DeleteExpenseTypeModalComponent } from './expensetypes/components/delete-expensetype-modal/delete-expensetype-modal.component';
import { EditExpenseTypeModalComponent } from './expensetypes/components/edit-expensetype-modal/edit-expensetype-modal.component';
import { RoutineEditComponent } from './routine/routine-edit.component';

import { CrmActivityComponent } from './crm-activity/crm-activity.component';
import { CrmActivityAddEditComponent } from './crm-activity/components/crm-activity-add-edit/crm-activity-add-edit.component';
import { CrmActivityDeleteComponent } from './crm-activity/components/crm-activity-delete/crm-activity-delete.component';
import { CrmCustomerComponent } from './crm-customer/crm-customer.component';
import { ActivityComponent } from './crm-customer/components/activity/activity.component';
import { InvoiceComponent } from './crm-customer/components/invoice/invoice.component';
import { DeliveryComponent } from './crm-customer/components/delivery/delivery.component';
import { OrderComponent } from './crm-customer/components/order/order.component';
import { CustomerViewComponent } from './crm-customer/components/customer-view/customer-view.component';
import { CrmCustomerAddEditComponent } from './crm-customer/components/crm-customer-add-edit/crm-customer-add-edit.component';
import { CrmCustomerDeleteComponent } from './crm-customer/components/crm-customer-delete/crm-customer-delete.component';
import { ViewDetailsComponent } from './crm-customer/components/view-details/view-details.component';


@NgModule({
  declarations: [
    /*UsersComponent,*/
    RoutineEditComponent,
    
    ExpenseTypesComponent,
    DeleteExpenseTypeModalComponent,
    EditExpenseTypeModalComponent,

    LeaveRequestsComponent,
    DeleteLeaveRequestModalComponent,
    EditLeaveRequestModalComponent,

    LeavesComponent,
    DeleteLeaveModalComponent,
    EditLeaveModalComponent,

    RoutePlansComponent,
    DeleteRoutePlanModalComponent,
    RoutePlanEditComponent,

    RolesComponent,
    DeleteRoleModalComponent,
    EditRoleModalComponent,

    BankingsComponent,
    DeleteBankingModalComponent,
    EditBankingModalComponent,

    DeliveryItemsComponent,
    DeleteDeliveryItemModalComponent,
    DeliveryItemEditComponent,

    CashReceiptsComponent,
    DeleteCashReceiptModalComponent,
    EditCashReceiptModalComponent,

    InvoicesComponent,
    DeleteInvoiceModalComponent,
    InvoiceEditComponent,

    RoutesComponent,
    DeleteRoutesModalComponent,
    EditRoutesModalComponent,

    EmployeesComponent,
    DeleteEmployeeModalComponent,
    EmployeeEditComponent,

    CompanyCustomersComponent,
    CompanyCustomerEditComponent,
    DeleteCompanyCustomerModalComponent,

    ContactsComponent,
    DeleteContactModalComponent,
    EditContactModalComponent,

    ShippingsComponent,
    DeleteShippingModalComponent,
    EditShippingModalComponent,

    BillingsComponent,
    DeleteBillingModalComponent,
    EditBillingModalComponent,

    CurrenciesComponent,
    DeleteCurrencyModalComponent,
    EditCurrencyModalComponent,

    PaymentTermsComponent,
    DeletePaymentTermModalComponent,
    EditPaymentTermModalComponent,

    VehiclesComponent,
    DeleteVehicleModalComponent,
    EditVehicleModalComponent,

    ItemsComponent,
    ViewItemModalComponent,

    QuotationsComponent,
    DeleteQuotationModalComponent,
    QuotationEditComponent,

    OrdersComponent,
    DeleteOrderModalComponent,
    OrderEditComponent,

    /*RoutePlansComponent,
    DeleteRoutePlanModalComponent,
    EditRoutePlanModalComponent,*/


    CustomersComponent,
    ProductsComponent,
    ECommerceComponent,
    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    FetchCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    EditCustomerModalComponent,
    DeleteProductModalComponent,
    DeleteProductsModalComponent,
    UpdateProductsStatusModalComponent,
    FetchProductsModalComponent,
    ProductEditComponent,
    RemarksComponent,
    SpecificationsComponent,
    DeleteRemarkModalComponent,
    DeleteRemarksModalComponent,
    FetchRemarksModalComponent,
    DeleteSpecModalComponent,
    DeleteSpecsModalComponent,
    FetchSpecsModalComponent,
    EditRemarkModalComponent,
    EditSpecModalComponent,

    CrmActivityComponent,
    CrmActivityAddEditComponent,
    CrmActivityDeleteComponent,
    CrmCustomerComponent,
    ActivityComponent,
    InvoiceComponent,
    DeliveryComponent,
    OrderComponent,
    CustomerViewComponent,
    CrmCustomerAddEditComponent,
    CrmCustomerDeleteComponent,
    ViewDetailsComponent,




  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ECommerceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  entryComponents: [
    /*DeleteUserModalComponent,
    DeleteUsersModalComponent,
    UpdateUsersStatusModalComponent,
    FetchUsersModalComponent,
    EditUserModalComponent,*/

    DeleteExpenseTypeModalComponent,
    EditExpenseTypeModalComponent,

    DeleteLeaveRequestModalComponent,
    EditLeaveRequestModalComponent,
    
    DeleteLeaveModalComponent,
    EditLeaveModalComponent,

    DeleteBankingModalComponent,
    EditBankingModalComponent,
    
    DeleteCompanyCustomerModalComponent,

    DeleteRoleModalComponent,
    EditRoleModalComponent,

    DeleteEmployeeModalComponent,

    DeleteContactModalComponent,
    EditContactModalComponent,

    DeleteContactModalComponent,
    EditContactModalComponent,

    DeleteShippingModalComponent,
    EditShippingModalComponent,

    DeleteBillingModalComponent,
    EditBillingModalComponent,

    DeleteCurrencyModalComponent,
    EditCurrencyModalComponent,

    DeletePaymentTermModalComponent,
    EditPaymentTermModalComponent,

    DeleteRoutesModalComponent,
    EditRoutesModalComponent,

    /*DeleteRoutePlanModalComponent,
    EditRoutePlanModalComponent,*/

    DeleteVehicleModalComponent,
    EditVehicleModalComponent,

    ViewItemModalComponent,

    DeleteQuotationModalComponent,
    
    DeleteRoutePlanModalComponent,    

    DeleteOrderModalComponent,

    DeleteInvoiceModalComponent,

    DeleteCashReceiptModalComponent,
    EditCashReceiptModalComponent,

    DeleteDeliveryItemModalComponent,
    DeliveryItemEditComponent,

    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    FetchCustomersModalComponent,
    EditCustomerModalComponent,
    DeleteProductModalComponent,
    DeleteProductsModalComponent,
    UpdateProductsStatusModalComponent,
    FetchProductsModalComponent,
    DeleteRemarkModalComponent,
    DeleteRemarksModalComponent,
    FetchRemarksModalComponent,
    DeleteSpecModalComponent,
    DeleteSpecsModalComponent,
    FetchSpecsModalComponent,
    EditRemarkModalComponent,
    EditSpecModalComponent,
    ViewDetailsComponent
  ]
})
export class ECommerceModule {}
