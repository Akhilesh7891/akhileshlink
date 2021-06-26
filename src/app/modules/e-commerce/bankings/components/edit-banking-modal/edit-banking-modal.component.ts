import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Banking } from '../../../_models/banking.model';
import { BankingsService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Banking = {
  id: undefined,
  employeeCode: '',
  employeeName: '',
  docNo: '',
  date: new Date(),
  location: '',
  amountDeposit: 0,
  depositDate: new Date(),
  bankBranch: '',
  remarks: '',
  employeeSignature: '',
};

@Component({
  selector: 'app-edit-banking-modal',
  templateUrl: './edit-banking-modal.component.html',
  styleUrls: ['./edit-banking-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditBankingModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  banking: Banking;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private bankingsService: BankingsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.bankingsService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.banking = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.bankingsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((banking: Banking) => {
        this.banking = banking;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      employeeCode: [this.banking.employeeCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      employeeName: [this.banking.employeeName, Validators.compose([Validators.required])],
      date: [this.banking.date, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      location: [this.banking.location, Validators.compose([Validators.required])],
      amountDeposit: [this.banking.amountDeposit],
      docNo: [this.banking.docNo],
      depositDate: [this.banking.depositDate, Validators.compose([Validators.required])],
      bankBranch: [this.banking.bankBranch, Validators.compose([Validators.required])],
      remarks: [this.banking.remarks, Validators.compose([Validators.required])],
      employeeSignature: [this.banking.employeeSignature, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareBanking();
    if (this.banking.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.bankingsService.update(this.banking).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.banking);
      }),
    ).subscribe(res => this.banking = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.bankingsService.create(this.banking).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.banking);
      }),
    ).subscribe((res: Banking) => this.banking = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareBanking() {
    const formData = this.formGroup.value;
    this.banking.employeeCode = formData.employeeCode;
    this.banking.employeeName = formData.employeeName;
    this.banking.docNo = formData.docNo;
    this.banking.date = formData.date;
    this.banking.location = formData.location;
    this.banking.amountDeposit = formData.amountDeposit;
    this.banking.depositDate = formData.depositDate;
    this.banking.bankBranch = formData.bankBranch;
    this.banking.remarks = formData.remarks;
    this.banking.employeeSignature = formData.employeeSignature;    
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
