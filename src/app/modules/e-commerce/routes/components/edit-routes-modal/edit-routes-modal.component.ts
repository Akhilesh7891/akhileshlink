import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Routes } from '../../../_models/routes.model';
import { RoutesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Routes = {
  id: undefined,
  routeCode: '',
  routeName: '',
  routeType: '',
  startLocation: '',
  endLocation: '',
  checkPoints: '',
  distance: '',
  status: 0,
};

@Component({
  selector: 'app-edit-routes-modal',
  templateUrl: './edit-routes-modal.component.html',
  styleUrls: ['./edit-routes-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditRoutesModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  routes: Routes;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private routesService: RoutesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.routesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.routes = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.routesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((routes: Routes) => {
        this.routes = routes;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      routeCode: [this.routes.routeCode, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      routeName: [this.routes.routeName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      routeType: [this.routes.routeType, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      startLocation: [this.routes.startLocation, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      endLocation: [this.routes.endLocation, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      checkPoints: [this.routes.checkPoints, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      distance: [this.routes.distance, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      status: [this.routes.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareRoutes();
    if (this.routes.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.routesService.update(this.routes).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.routes);
      }),
    ).subscribe(res => this.routes = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.routesService.create(this.routes).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.routes);
      }),
    ).subscribe((res: Routes) => this.routes = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRoutes() {
    const formData = this.formGroup.value;    
    this.routes.routeCode = formData.routeCode;
    this.routes.routeName = formData.routeName;
    this.routes.routeType = formData.routeType;
    this.routes.startLocation = formData.startLocation;
    this.routes.endLocation = formData.endLocation;
    this.routes.checkPoints = formData.checkPoints;
    this.routes.distance = formData.distance;    
    this.routes.status = +formData.status;    
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
