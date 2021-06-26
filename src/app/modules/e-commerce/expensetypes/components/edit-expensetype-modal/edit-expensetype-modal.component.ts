import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ExpenseType } from '../../../_models/expensetype.model';
import { ExpenseTypesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: ExpenseType = {
  id: undefined,
  expenseTypeCode: '',
  leaveCode: '',
  status: 0,
};

@Component({
  selector: 'app-edit-expensetype-modal',
  templateUrl: './edit-expensetype-modal.component.html',
  styleUrls: ['./edit-expensetype-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditExpenseTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  expensetype: ExpenseType;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private expensetypesService: ExpenseTypesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.expensetypesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.expensetype = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.expensetypesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((expensetype: ExpenseType) => {
        this.expensetype = expensetype;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      expenseTypeCode: [this.expensetype.expenseTypeCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      leaveCode: [this.expensetype.leaveCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.expensetype.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareExpenseType();
    if (this.expensetype.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.expensetypesService.update(this.expensetype).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.expensetype);
      }),
    ).subscribe(res => this.expensetype = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.expensetypesService.create(this.expensetype).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.expensetype);
      }),
    ).subscribe((res: ExpenseType) => this.expensetype = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareExpenseType() {
    const formData = this.formGroup.value;    
    this.expensetype.expenseTypeCode = formData.expenseTypeCode;
    this.expensetype.leaveCode = formData.leaveCode;
    this.expensetype.status = +formData.status;    
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
