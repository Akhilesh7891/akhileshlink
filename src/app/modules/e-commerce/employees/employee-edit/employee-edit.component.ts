import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Employee } from '../../_models/employee.model';
import { EmployeesService } from '../../_services';

const EMPTY_EMPLOYEE: Employee = {
  id: undefined,
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: 8888888888,
  designation: '',
  department: '',
  status: 0,
  gender: 1,
  fatherName: '',
  bloodGroup: '',
  DOB: '',
  branch: '',
  cashLimit: '',
  citizenship: '',
  dlNumber: '',
  dlExpiryDate: '',
  passportNo: '',
  passportExpiryDate: '',
  firstGovIDNo: '',
  secondGovIDNo: '',
  thirdGovIDNo: '',
  firstGovIDType: '',
  secondGovIDType: '',
  thirdGovIDType: '',
  workAddress: '',
  workCity: '',
  workState: '',
  workZip: 0,
  workCountry: '',
  workPhone: 0,
  workMobile: 0,
  workEmailID: '',
  homeAddress: '',
  homeCity: '',
  homeState: '',
  homeZip: 0,
  homeCountry: '',
  homePhone: 0,
  homeMobile: 0,
  homeEmail: '',
  IMEICode1: '',
  IMEICode2: '',
};

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  id: number;
  employee: Employee;
  previous: Employee;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    ORG_DETAILS: 1,
    GOV_DETAILS: 2,
    WORK_DETAILS: 3,
    HOME_DETAILS: 4,
    IMEI_DETAILS: 5
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.employeeService.isLoading$;
    this.loadEmployee();
  }

  loadEmployee() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.employeeService.getItemById(this.id);
        }
        return of(EMPTY_EMPLOYEE);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Employee) => {
      if (!res) {
        this.router.navigate(['/employees'], { relativeTo: this.route });
      }

      this.employee = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.employee) {
      return;
    }

    this.formGroup = this.fb.group({
      //Personal Info Details
      employeeCode: [this.employee.employeeCode],
      firstName: [this.employee.firstName],
      lastName: [this.employee.lastName],
      bloodGroup: [this.employee.bloodGroup],
      fatherName: [this.employee.fatherName],
      gender: [this.employee.gender],
      DOB: [this.employee.DOB],
      email: [this.employee.email],
      phone: [this.employee.phone],
      
      //Organization Details
      designation: [this.employee.designation, /*Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])*/],
      department: [this.employee.department, /*Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])*/],
      branch: [this.employee.branch, /*Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])*/],
      cashLimit: [this.employee.cashLimit, /*Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])*/],

      //Gov Details
      citizenship: [this.employee.citizenship],
      dlNumber: [this.employee.dlNumber],
      dlExpiryDate: [this.employee.dlExpiryDate],
      passportNo: [this.employee.passportNo],
      passportExpiryDate: [this.employee.passportExpiryDate],
      firstGovIDNo: [this.employee.firstGovIDNo],
      secondGovIDNo: [this.employee.secondGovIDNo],
      thirdGovIDNo: [this.employee.thirdGovIDNo],
      firstGovIDType: [this.employee.firstGovIDType],
      secondGovIDType: [this.employee.secondGovIDType],
      thirdGovIDType: [this.employee.thirdGovIDType],

      //Work Details
      workAddress: [this.employee.workAddress],
      workCity: [this.employee.workCity],
      workState: [this.employee.workState],
      workZip: [this.employee.workZip],
      workCountry: [this.employee.workCountry],
      workPhone: [this.employee.workPhone],
      workMobile: [this.employee.workMobile],
      workEmailID: [this.employee.workEmailID],
      
      //Home Details
      homeAddress: [this.employee.homeAddress],
      homeCity: [this.employee.homeCity],
      homeState: [this.employee.homeState],
      homeZip: [this.employee.homeZip],
      homeCountry: [this.employee.homeCountry],
      homePhone: [this.employee.homePhone],
      homeMobile: [this.employee.homeMobile],
      homeEmail: [this.employee.homeEmail],
      
      //IMEI Code
      IMEICode1: [this.employee.IMEICode1],
      IMEICode2: [this.employee.IMEICode2],

      status: [this.employee.status],
      
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.employee = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.employee = Object.assign(this.employee, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.employeeService.update(this.employee).pipe(
      tap(() => this.router.navigate(['/ecommerce/employees'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.employee);
      })
    ).subscribe(res => this.employee = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.employeeService.create(this.employee).pipe(
      tap(() => this.router.navigate(['/ecommerce/employees'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.employee);
      })
    ).subscribe(res => this.employee = res as Employee);
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
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

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
