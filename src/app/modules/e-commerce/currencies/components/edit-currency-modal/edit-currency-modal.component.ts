import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Currency } from '../../../_models/currency.model';
import { CurrenciesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Currency = {
  id: undefined,
  name: '',
  currencyCode: '',
  currencySign: '',
  decimalPlace: '',
  status: 0,
};

@Component({
  selector: 'app-edit-currency-modal',
  templateUrl: './edit-currency-modal.component.html',
  styleUrls: ['./edit-currency-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCurrencyModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  currency: Currency;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private currencysService: CurrenciesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.currencysService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.currency = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.currencysService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((currency: Currency) => {
        this.currency = currency;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [this.currency.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      currencyCode: [this.currency.currencyCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      currencySign: [this.currency.currencySign, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      decimalPlace: [this.currency.decimalPlace, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      status: [this.currency.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareCurrency();
    if (this.currency.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.currencysService.update(this.currency).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.currency);
      }),
    ).subscribe(res => this.currency = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.currencysService.create(this.currency).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.currency);
      }),
    ).subscribe((res: Currency) => this.currency = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCurrency() {
    const formData = this.formGroup.value;    
    this.currency.name = formData.name;
    this.currency.currencyCode = formData.currencyCode;
    this.currency.currencySign = formData.currencySign;
    this.currency.decimalPlace = formData.decimalPlace;
    this.currency.status = +formData.status;    
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
