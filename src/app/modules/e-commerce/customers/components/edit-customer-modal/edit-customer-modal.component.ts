import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, Observable, throwError, pipe } from 'rxjs';
import { catchError, finalize, first, tap, map } from 'rxjs/operators';
import { Customer } from '../../../_models/customer.model';
import { CustomersService } from '../../../_services';
import { CompanyCustomersService } from '../../../_services';
import { EmployeesService } from '../../../_services';
import { RolesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_CUSTOMER: Customer = {
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  userCode: '',
  status: 0,
  dateOfBirth: '',
  password: '',
  type: 1,
  userId: 0,
  phone: 0,
  gender: '',
  roleId: 0,
};

@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrls: ['./edit-customer-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCustomerModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  customer: Customer;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  userType = 1; // 1=> for customer, 2=> for employee
  customers = [];
  employees = [];
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    public companyCustomerService: CompanyCustomersService,
    public employeesService: EmployeesService,
    public rolesService: RolesService
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
    this.loadCompanyCustomers();
    this.loadEmployees();
    this.loadRoles();
  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      const sb = this.customersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: Customer) => {
        this.customer = customer;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadCompanyCustomers() {
    this.companyCustomerService.fetch();

  }

  loadEmployees() {
    this.employeesService.fetch();
  }

  loadRoles() {
    this.rolesService.fetch();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      firstName: [this.customer.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.customer.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
      //dob: [this.customer.dateOfBbirth, Validators.compose([Validators.nullValidator])],
      phone: [this.customer.phone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      userName: [this.customer.userName, Validators.compose([Validators.required])],
      userCode: [this.customer.userCode, Validators.compose([Validators.required])],
      //gender: [this.customer.gender, Validators.compose([Validators.required])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      confirmPassword: ['',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      userType: [this.customer.type, Validators.compose([Validators.required])],
      userId: [this.customer.userId, Validators.compose([Validators.required])],
      roleId: [this.customer.roleId, Validators.compose([Validators.required])],
      status: [this.customer.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareCustomer();
    if (this.customer.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.customersService.update(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => this.customer = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customersService.create(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe((res: Customer) => this.customer = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    /*this.customer.dob = new Date(formData.dob);*/
    this.customer.email = formData.email;
    this.customer.firstName = formData.firstName;
    //this.customer.dateOfBirth = formData.dob;
    this.customer.phone = formData.phone;
    this.customer.userCode = formData.userCode;
    this.customer.lastName = formData.lastName;
    this.customer.type = formData.userType;
    this.customer.userName = formData.userName;
    this.customer.userId = formData.userId;
    this.customer.roleId = formData.roleId;
    this.customer.status = formData.status;
    this.customer.password = formData.password;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  onSelectUser(userId): void {
    this.resetForm();
    const formData = this.formGroup.value;
    var users: Array<any>;
    if(formData.userType == 1){
      //Customer
      this.customersService.items$.pipe(first()).subscribe(value => this.customers = value);
      if(this.customers && this.customers.length > 0){
        users = this.customers.filter(obj=>{
          return obj.id == userId;
        })
      }


    }else if(formData.userType == 2){
      //Employee
      this.employeesService.items$.pipe(first()).subscribe(value => this.employees = value);
      if(this.employees && this.employees.length > 0){
        users = this.employees.filter(obj=>{
          return obj.id == userId;
        })
      }
    }

    if(users && users.length > 0){
      let user = users[0];
      this.formGroup.patchValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
        userName: user?.email,
        userCode: user?.userCode ? user?.userCode : user?.employeeCode,
        userType: formData.userType,
        userId: user?.id,
        status: user?.status
      });
    }
  }

  resetForm(): void {
    this.formGroup.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userName: '',
      userCode: '',
      userId: 0,
      status: 0,
      password: '',
      confirmPassword: '',
      roleId: 0
    });
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
