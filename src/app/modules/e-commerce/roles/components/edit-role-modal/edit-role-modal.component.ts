import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Role } from '../../../_models/role.model';
import { RolesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Role = {
  id: undefined,
  roleName: '',
  status: 0,
};

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  role: Role;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.role = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.rolesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((role: Role) => {
        this.role = role;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      roleName: [this.role.roleName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.role.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareRole();
    if (this.role.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.rolesService.update(this.role).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.role);
      }),
    ).subscribe(res => this.role = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.rolesService.create(this.role).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.role);
      }),
    ).subscribe((res: Role) => this.role = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRole() {
    const formData = this.formGroup.value;    
    this.role.roleName = formData.roleName;
    this.role.status = +formData.status;    
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
