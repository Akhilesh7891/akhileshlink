import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { ShippingsService } from '../../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { CustomerShipping } from '../../../../_models/customer-shipping.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_SHIPPING: CustomerShipping = {
  id: undefined,
  customerId: undefined,
  shipAddressCode: '',
  shipAddress: '',
  shipCity: '',
  shipState: '',
  shipZipCode: 0,
  shipCountry: ''
};

@Component({
  selector: 'app-edit-shipping-modal',
  templateUrl: './edit-shipping-modal.component.html',
  styleUrls: ['./edit-shipping-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditShippingModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() customerId: number;
  isLoading$;
  shipping: CustomerShipping;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private shippingsService: ShippingsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.shippingsService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.shipping = EMPTY_SHIPPING;
      this.shipping.customerId = this.customerId;
      this.loadForm();
    } else {
      const sb = this.shippingsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_SHIPPING;
          empty.customerId = this.customerId;
          return of(empty);
        })
      ).subscribe((shipping: CustomerShipping) => {
        this.shipping = shipping;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
     //Shiping Details
      shipAddressCode: [this.shipping.shipAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddress: [this.shipping.shipAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      shipCity: [this.shipping.shipCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipState: [this.shipping.shipState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipZipCode: [this.shipping.shipZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      shipCountry: [this.shipping.shipCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
    });
  }

  save() {
    this.prepareShipping();
    if (this.shipping.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.shippingsService.update(this.shipping).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.shipping);
      }),
    ).subscribe(res => this.shipping = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    
    console.log(this.shipping);
    
    const sbCreate = this.shippingsService.create(this.shipping).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.shipping);
      }),
    ).subscribe((res: CustomerShipping) => this.shipping = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareShipping() {
    const formData = this.formGroup.value;
    this.shipping.shipAddressCode = formData.shipAddressCode;
    this.shipping.shipAddress = formData.shipAddress;
    this.shipping.shipCity = formData.shipCity;
    this.shipping.shipState = formData.shipState;
    this.shipping.shipZipCode = formData.shipZipCode;
    this.shipping.shipCountry = formData.shipCountry;
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
