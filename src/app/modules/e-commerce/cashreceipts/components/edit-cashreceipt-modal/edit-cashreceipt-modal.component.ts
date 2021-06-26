import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CashReceipt } from '../../../_models/cashreceipt.model';
import { CashReceiptsService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: CashReceipt = {
  id: undefined,
  cashReceipt: '',
  orderCode: '',
  customerCode: '',
  customerName: '',
  contactPerson: '',
  mobile: 0,
  status: 0,
  docNo: '',
  date: new Date(),
  location: '',
  amount: 0,
  remarks: '',
};

@Component({
  selector: 'app-edit-cashreceipt-modal',
  templateUrl: './edit-cashreceipt-modal.component.html',
  styleUrls: ['./edit-cashreceipt-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCashReceiptModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  cashreceipt: CashReceipt;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private cashreceiptsService: CashReceiptsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.cashreceiptsService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.cashreceipt = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.cashreceiptsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((cashreceipt: CashReceipt) => {
        this.cashreceipt = cashreceipt;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      cashReceipt: [this.cashreceipt.cashReceipt],
      orderCode: [this.cashreceipt.orderCode],
      customerCode: [this.cashreceipt.customerCode],
      customerName: [this.cashreceipt.customerName],
      contactPerson: [this.cashreceipt.contactPerson],
      mobile: [this.cashreceipt.mobile],
      status: [this.cashreceipt.status],
      docNo: [this.cashreceipt.docNo],
      date: [this.cashreceipt.date],
      location: [this.cashreceipt.location],
      amount: [this.cashreceipt.amount],
      remarks: [this.cashreceipt.remarks]
    });
  }

  save() {
    this.prepareCashReceipt();
    if (this.cashreceipt.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.cashreceiptsService.update(this.cashreceipt).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.cashreceipt);
      }),
    ).subscribe(res => this.cashreceipt = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.cashreceiptsService.create(this.cashreceipt).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.cashreceipt);
      }),
    ).subscribe((res: CashReceipt) => this.cashreceipt = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCashReceipt() {
    const formData = this.formGroup.value;
    this.cashreceipt.cashReceipt = formData.cashReceipt;
    this.cashreceipt.orderCode = formData.orderCode;
    this.cashreceipt.customerCode = formData.customerCode;
    this.cashreceipt.customerName = formData.customerName;
    this.cashreceipt.contactPerson = formData.contactPerson;
    this.cashreceipt.mobile = formData.mobile;
    this.cashreceipt.status = formData.status;
    this.cashreceipt.docNo = formData.docNo;
    this.cashreceipt.date = formData.date;
    this.cashreceipt.location = formData.location;
    this.cashreceipt.amount = formData.amount;
    this.cashreceipt.remarks = formData.remarks;   
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
