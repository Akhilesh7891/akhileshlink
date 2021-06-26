import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { BillingsService } from '../../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { CustomerBilling } from '../../../../_models/customer-billing.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_BILLING: CustomerBilling = {
  id: undefined,
  customerId: undefined,
  billAddressCode: '',
  billAddress: '',
  billCity: '',
  billState: '',
  billZipCode: 0,
  billCountry: ''
};

@Component({
  selector: 'app-edit-billing-modal',
  templateUrl: './edit-billing-modal.component.html',
  styleUrls: ['./edit-billing-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditBillingModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() customerId: number;
  isLoading$;
  billing: CustomerBilling;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private billingsService: BillingsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.billingsService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.billing = EMPTY_BILLING;
      this.billing.customerId = this.customerId;
      this.loadForm();
    } else {
      const sb = this.billingsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_BILLING;
          empty.customerId = this.customerId;
          return of(empty);
        })
      ).subscribe((billing: CustomerBilling) => {
        this.billing = billing;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      billAddressCode: [this.billing.billAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billAddress: [this.billing.billAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      billCity: [this.billing.billCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billState: [this.billing.billState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billZipCode: [this.billing.billZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      billCountry: [this.billing.billCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      customerId: [this.billing.customerId]
    });
  }

  save() {
    this.prepareBilling();
    if (this.billing.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.billingsService.update(this.billing).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.billing);
      }),
    ).subscribe(res => this.billing = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    
    console.log(this.billing);
    
    const sbCreate = this.billingsService.create(this.billing).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.billing);
      }),
    ).subscribe((res: CustomerBilling) => this.billing = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareBilling() {
    const formData = this.formGroup.value;
    this.billing.customerId = this.customerId;
    this.billing.billAddressCode = formData.billAddressCode;
    this.billing.billAddress = formData.billAddress;
    this.billing.billCity = formData.billCity;
    this.billing.billState = formData.billState;
    this.billing.billZipCode = formData.billZipCode;
    this.billing.billCountry = formData.billCountry;
  }

  ngOnDestroy(): void {
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

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
