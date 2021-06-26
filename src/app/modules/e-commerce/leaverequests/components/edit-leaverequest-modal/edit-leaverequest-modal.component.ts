import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { LeaveRequest } from '../../../_models/leaverequest.model';
import { LeaveRequestsService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: LeaveRequest = {
  id: undefined,
  employeeCode: '',
  formDate: new Date(),
  toDate: new Date(),
  leaveDays: 0,
  unpaiddays: 0,
  remark: '',
  remarkBy: '',
  leaveCode: '',
  leaveType: '',
  leaveBalance: 0,
  status: 0 // Active = 0 | Inactive = 1
};

@Component({
  selector: 'app-edit-leaverequest-modal',
  templateUrl: './edit-leaverequest-modal.component.html',
  styleUrls: ['./edit-leaverequest-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditLeaveRequestModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  leaverequest: LeaveRequest;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private leaverequestsService: LeaveRequestsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.leaverequestsService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.leaverequest = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.leaverequestsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((leaverequest: LeaveRequest) => {
        this.leaverequest = leaverequest;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      employeeCode: [this.leaverequest.employeeCode, Validators.compose([Validators.required])],
      formDate: [this.leaverequest.formDate, Validators.compose([Validators.required])],
      toDate: [this.leaverequest.toDate, Validators.compose([Validators.required])],
      leaveDays: [this.leaverequest.leaveDays, Validators.compose([Validators.required])],
      unpaiddays: [this.leaverequest.unpaiddays, Validators.compose([Validators.required])],
      remark: [this.leaverequest.remark, Validators.compose([Validators.required])],
      remarkBy: [this.leaverequest.remarkBy, Validators.compose([Validators.required])],
      leaveCode: [this.leaverequest.leaveCode, Validators.compose([Validators.required])],
      leaveType: [this.leaverequest.leaveType, Validators.compose([Validators.required])],
      /*leaveBalance: [this.leaverequest.leaveBalance, Validators.compose([Validators.required])],*/
      status: [this.leaverequest.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareLeaveRequest();
    if (this.leaverequest.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.leaverequestsService.update(this.leaverequest).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.leaverequest);
      }),
    ).subscribe(res => this.leaverequest = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.leaverequestsService.create(this.leaverequest).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.leaverequest);
      }),
    ).subscribe((res: LeaveRequest) => this.leaverequest = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareLeaveRequest() {
    const formData = this.formGroup.value;    
    this.leaverequest.employeeCode = formData.employeeCode;
    this.leaverequest.formDate = formData.formDate;
    this.leaverequest.toDate = formData.toDate;
    this.leaverequest.leaveDays = formData.leaveDays;
    this.leaverequest.unpaiddays = formData.unpaiddays;
    this.leaverequest.remark = formData.remark;
    this.leaverequest.remarkBy = formData.remarkBy;
    this.leaverequest.leaveCode = formData.leaveCode;
    this.leaverequest.leaveType = formData.leaveType;
    this.leaverequest.status = +formData.status;
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
