import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { PaymentTerm } from '../../../_models/paymentterm.model';
import { PaymentTermsService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: PaymentTerm = {
  id: undefined,
  paymentTermCode: '',
  paymentTerm: '',
  description: '',
  days: 0,
  status: 0,
};

@Component({
  selector: 'app-edit-paymentterm-modal',
  templateUrl: './edit-paymentterm-modal.component.html',
  styleUrls: ['./edit-paymentterm-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditPaymentTermModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  paymentterm: PaymentTerm;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private paymenttermsService: PaymentTermsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.paymenttermsService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.paymentterm = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.paymenttermsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((paymentterm: PaymentTerm) => {
        this.paymentterm = paymentterm;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      paymentTermCode: [this.paymentterm.paymentTermCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      paymentTerm: [this.paymentterm.paymentTerm, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      description: [this.paymentterm.description, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      days: [this.paymentterm.days, Validators.compose([Validators.required])],
      status: [this.paymentterm.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.preparePaymentTerm();
    if (this.paymentterm.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.paymenttermsService.update(this.paymentterm).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.paymentterm);
      }),
    ).subscribe(res => this.paymentterm = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.paymenttermsService.create(this.paymentterm).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.paymentterm);
      }),
    ).subscribe((res: PaymentTerm) => this.paymentterm = res);
    this.subscriptions.push(sbCreate);
  }

  private preparePaymentTerm() {
    const formData = this.formGroup.value;    
    this.paymentterm.paymentTermCode = formData.paymentTermCode;
    this.paymentterm.paymentTerm = formData.paymentTerm;
    this.paymentterm.description = formData.description;
    this.paymentterm.days = formData.days;
    this.paymentterm.status = +formData.status;    
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
