import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Leave } from '../../../_models/leave.model';
import { LeavesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_LEAVE: Leave = {
  id: undefined,
  leaveCode: '',
  leaveType: '',
  leaveBalance: 0,
  status: 0,
};

@Component({
  selector: 'app-edit-leave-modal',
  templateUrl: './edit-leave-modal.component.html',
  styleUrls: ['./edit-leave-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditLeaveModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  leave: Leave;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private leavesService: LeavesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.leavesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.leave = EMPTY_LEAVE;
      this.loadForm();
    } else {
      const sb = this.leavesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_LEAVE);
        })
      ).subscribe((leave: Leave) => {
        this.leave = leave;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      leaveCode: [this.leave.leaveCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      leaveType: [this.leave.leaveType, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      leaveBalance: [this.leave.leaveBalance, Validators.compose([Validators.required])],
      status: [this.leave.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareLeave();
    if (this.leave.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.leavesService.update(this.leave).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.leave);
      }),
    ).subscribe(res => this.leave = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.leavesService.create(this.leave).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.leave);
      }),
    ).subscribe((res: Leave) => this.leave = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareLeave() {
    const formData = this.formGroup.value;    
    this.leave.leaveCode = formData.leaveCode;
    this.leave.leaveType = formData.leaveType;
    this.leave.leaveBalance = formData.leaveBalance;
    this.leave.status = +formData.status;    
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
