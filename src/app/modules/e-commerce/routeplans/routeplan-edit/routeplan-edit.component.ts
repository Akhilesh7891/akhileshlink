import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { RoutePlan } from '../../_models/routeplan.model';
import { RoutePlansService } from '../../_services';
import { OrdersService } from '../../_services';
import { RoutesService } from '../../_services';
import { VehiclesService } from '../../_services';
import { EmployeesService } from '../../_services';

const EMPTY_QUOTATION: RoutePlan = {
  id: undefined,
  itemCode: '',
  itemName: '',
  quantity: 0,
  volume: '',
  weight: 0,
  routeId: 0,
  vehicleId: 0,
  employeeId: 0,
  checkPointId: 0,
  itemList: []
};

@Component({
  selector: 'app-routeplan-edit',
  templateUrl: './routeplan-edit.component.html',
  styleUrls: ['./routeplan-edit.component.scss']
})
export class RoutePlanEditComponent implements OnInit, OnDestroy {
  id: number;
  routeplan: RoutePlan;
  previous: RoutePlan;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  routeplanForm: FormGroup;
  itemList: FormArray;
  private subscriptions: Subscription[] = [];
  public totalSumAmountBeforeTax: number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public totalAmountAfterTax: number = 0;

  constructor(
    private routeplanService: RoutePlansService,
    private router: Router,
    private route: ActivatedRoute,
    private routeplanFB: FormBuilder,
    public ordersService: OrdersService,
    public routesService: RoutesService,
    public vehicleService: VehiclesService,
    public employeesService: EmployeesService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.routeplanService.isLoading$;
    this.loadRoutePlan();
    this.ordersService.fetch();
    this.routesService.fetch();
    this.vehicleService.fetch();
    this.employeesService.fetch();
  }

  loadRoutePlan() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.routeplanService.getItemById(this.id);
        }
        return of(EMPTY_QUOTATION);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: RoutePlan) => {
      if (!res) {
        this.router.navigate(['/ecommerce/routeplans'], { relativeTo: this.route });
      }

      this.routeplan = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.routeplan) {
      return;
    }

    var formObj = { 
      itemCode: [this.routeplan.routeId, Validators.compose([Validators.required])],
      itemName: [this.routeplan.routeId, Validators.compose([Validators.required])],
      quantity: [this.routeplan.routeId, Validators.compose([Validators.required])],
      volume: [this.routeplan.routeId, Validators.compose([Validators.required])],
      weight: [this.routeplan.routeId, Validators.compose([Validators.required])],
      routeId: [this.routeplan.routeId, Validators.compose([Validators.required])],
      vehicleId: [this.routeplan.routeId, Validators.compose([Validators.required])],
      employeeId: [this.routeplan.routeId, Validators.compose([Validators.required])],
      checkPointId: [this.routeplan.checkPointId, Validators.compose([Validators.required])],
      itemList: this.routeplanFB.array([this.createItem({ 'orderId': null, 'totalWeight': null, 'totalVolume': null, 'deliveryDate': null, 'routeId': null, 'vehicleId': null, 'employeeId': null})]),
    }
    this.routeplanForm = this.routeplanFB.group(formObj);

    console.log("this.routeplan.itemList",this.routeplan.itemList);

    if(this.routeplan && this.routeplan.id && this.routeplan.id > 0){
      this.mapItemsValues(this.routeplan.itemList);
    }

  }

  /* Items fileds value mapping with form control
   * @ param  JSON Array
   */
  mapItemsValues(items: any) {
    var __this = this;
    this.itemList = this.routeplanForm.get('itemList') as FormArray;
    items.forEach(function (obj, index) {
      if (index >= __this.itemList.length) {
          __this.itemList.push(__this.createItem({ 'orderId': obj.orderId, 'totalWeight': obj.totalWeight, 'totalVolume': obj.totalVolume, 'deliveryDate': obj.deliveryDate, 'routeId': obj.routeId, 'vehicleId': obj.vehicleId, 'employeeId': obj.employeeId}));
      } else {
          __this.itemList.at(index)['controls'].orderId.patchValue(obj.orderId);
          __this.itemList.at(index)['controls'].totalWeight.patchValue(obj.totalWeight);
          __this.itemList.at(index)['controls'].totalVolume.patchValue(obj.totalVolume);
          __this.itemList.at(index)['controls'].deliveryDate.patchValue(obj.deliveryDate);
          __this.itemList.at(index)['controls'].routeId.patchValue(obj.routeId);
          __this.itemList.at(index)['controls'].vehicleId.patchValue(obj.vehicleId);
          __this.itemList.at(index)['controls'].employeeId.patchValue(obj.employeeId);
      }
    });
  }

  /* Create Alternate User */
  createItem(data: any): FormGroup {
    return this.routeplanFB.group({
      orderId: [data.orderId, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(10)])]],
      totalWeight: [data.totalWeight, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(100)])]],
      totalVolume: [data.totalVolume, [Validators.compose([Validators.required,Validators.min(1), Validators.max(100)])]],
      deliveryDate: [data.deliveryDate, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(5)])]],
      routeId: [data.routeId, [Validators.compose([Validators.required,Validators.min(1), Validators.max(100)])]],
      vehicleId: [data.vehicleId,[Validators.compose([Validators.min(1), Validators.max(100)])]],
      employeeId: [data.employeeId, [Validators.compose([Validators.min(1), Validators.max(100)])]]
    });
  }

  addItem(): void {
    this.itemList = this.routeplanForm.get('itemList') as FormArray;
    this.itemList.push(this.createItem({ 'orderId': null, 'totalWeight': null, 'totalVolume': null, 'deliveryDate': null, 'routeId': null, 'vehicleId': null, 'employeeId': null}));
  }

  removeItem(index) {
    this.itemList = this.routeplanForm.get('itemList') as FormArray;
    this.itemList.removeAt(index);
  }

  getItems(): FormArray {
    return <FormArray>this.routeplanForm.controls.itemList;
  }

  save() {
    this.routeplanForm.markAllAsTouched();
    if (!this.routeplanForm.valid) {
      return;
    }

    const formValues = this.routeplanForm.value;
    this.routeplan = Object.assign(this.routeplan, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.routeplanService.update(this.routeplan).pipe(
      tap(() => this.router.navigate(['/ecommerce/routeplans'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.routeplan);
      })
    ).subscribe(res => this.routeplan = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.routeplanService.create(this.routeplan).pipe(
      tap(() => this.router.navigate(['/ecommerce/routeplans'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.routeplan);
      })
    ).subscribe(res => this.routeplan = res as RoutePlan);
    this.subscriptions.push(sbCreate);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.routeplanForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.routeplanForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.routeplanForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.routeplanForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
