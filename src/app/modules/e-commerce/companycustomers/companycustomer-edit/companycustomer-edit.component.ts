import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { CompanyCustomer } from '../../_models/companycustomer.model';
import { CompanyCustomersService } from '../../_services';

const EMPTY_CUSTOMER: CompanyCustomer = {
  id: undefined,
  customerCode: '',
  customerName: '',
  customerGroup: '',
  currency: '',
  salesEmployee: '',
  sapCustomer: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: 0,
  designation: ''
};

@Component({
  selector: 'app-companycustomer-edit',
  templateUrl: './companycustomer-edit.component.html',
  styleUrls: ['./companycustomer-edit.component.scss']
})
export class CompanyCustomerEditComponent implements OnInit, OnDestroy {
  id: number;
  companycustomer: CompanyCustomer;
  previous: CompanyCustomer;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    CONTACT_TAB: 1,
    SHIPPING_TAB: 2,
    BILLING_TAB: 3    
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private companyCustomersService: CompanyCustomersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.companyCustomersService.isLoading$;
    this.loadCompanyCustomer();
  }

  loadCompanyCustomer() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.companyCustomersService.getItemById(this.id);
        }
        return of(EMPTY_CUSTOMER);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: CompanyCustomer) => {
      if (!res) {
        this.router.navigate(['/customers'], { relativeTo: this.route });
      }

      this.companycustomer = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.companycustomer) {
      return;
    }

    this.formGroup = this.fb.group({
      customerCode: [this.companycustomer.customerCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      customerName: [this.companycustomer.customerName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      customerGroup: [this.companycustomer.customerGroup, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      currency: [this.companycustomer.currency, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      salesEmployee: [this.companycustomer.salesEmployee, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      sapCustomer: [this.companycustomer.sapCustomer, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      firstName: [this.companycustomer.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.companycustomer.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.companycustomer.email, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      phone: [this.companycustomer.phone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      designation: [this.companycustomer.designation, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])]
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.companycustomer = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.companycustomer = Object.assign(this.companycustomer, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.companyCustomersService.update(this.companycustomer).pipe(
      tap(() => this.router.navigate(['/ecommerce/companycustomers'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.companycustomer);
      })
    ).subscribe(res => this.companycustomer = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.companyCustomersService.create(this.companycustomer).pipe(
      tap(() => this.router.navigate(['/ecommerce/companycustomers'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.companycustomer);
      })
    ).subscribe(res => this.companycustomer = res as CompanyCustomer);
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
