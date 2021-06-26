import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Vehicle } from '../../../_models/vehicle.model';
import { VehiclesService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Vehicle = {
  id: undefined,
  vehicleCode: '',
  vehicleType: '',
  vehicleModel: '',
  vehicleNumber: '',
  registrationNumber: '',
  registrationValidUpTo: '',
  ownerName: '',
  engineNumber: '',
  chassisNumber: '',
  weightCapacity: '',
  volumeCapacity: '',
  manufacturingYear: '',
  fuelCapacity: '',
  insuranceValidUpTo: '',
  pollutionValidUpTo: '',
  vehicleDocuments: '',
  status: 0, // Active = 0 | Inactive = 1
};

@Component({
  selector: 'app-edit-vehicle-modal',
  templateUrl: './edit-vehicle-modal.component.html',
  styleUrls: ['./edit-vehicle-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditVehicleModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  vehicle: Vehicle;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private vehiclesService: VehiclesService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.vehiclesService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.vehicle = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.vehiclesService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((vehicle: Vehicle) => {
        this.vehicle = vehicle;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      vehicleCode: [this.vehicle.vehicleCode],
      vehicleType: [this.vehicle.vehicleType],
      vehicleModel: [this.vehicle.vehicleModel],
      vehicleNumber: [this.vehicle.vehicleNumber],
      registrationNumber: [this.vehicle.registrationNumber],
      registrationValidUpTo: [this.vehicle.registrationValidUpTo],
      ownerName: [this.vehicle.ownerName],
      engineNumber: [this.vehicle.engineNumber],
      chassisNumber: [this.vehicle.chassisNumber],
      weightCapacity: [this.vehicle.weightCapacity],
      volumeCapacity: [this.vehicle.volumeCapacity],
      manufacturingYear: [this.vehicle.manufacturingYear],
      fuelCapacity: [this.vehicle.fuelCapacity],
      insuranceValidUpTo: [this.vehicle.insuranceValidUpTo],
      pollutionValidUpTo: [this.vehicle.pollutionValidUpTo],
      vehicleDocuments: [this.vehicle.vehicleDocuments],
      status: [this.vehicle.status, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareVehicle();
    if (this.vehicle.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.vehiclesService.update(this.vehicle).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.vehicle);
      }),
    ).subscribe(res => this.vehicle = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.vehiclesService.create(this.vehicle).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.vehicle);
      }),
    ).subscribe((res: Vehicle) => this.vehicle = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareVehicle() {
    const formData = this.formGroup.value;
    this.vehicle.vehicleCode = formData.vehicleCode;
    this.vehicle.vehicleType = formData.vehicleType;
    this.vehicle.vehicleModel = formData.vehicleModel;
    this.vehicle.vehicleNumber = formData.vehicleNumber;
    this.vehicle.registrationNumber = formData.registrationNumber;
    this.vehicle.registrationValidUpTo = formData.registrationValidUpTo;
    this.vehicle.ownerName = formData.ownerName;
    this.vehicle.engineNumber = formData.engineNumber;
    this.vehicle.chassisNumber = formData.chassisNumber;
    this.vehicle.weightCapacity = formData.weightCapacity;
    this.vehicle.volumeCapacity = formData.volumeCapacity;
    this.vehicle.manufacturingYear = formData.manufacturingYear;
    this.vehicle.fuelCapacity = formData.fuelCapacity;
    this.vehicle.insuranceValidUpTo = formData.insuranceValidUpTo;
    this.vehicle.pollutionValidUpTo = formData.pollutionValidUpTo;
    this.vehicle.vehicleDocuments = formData.vehicleDocuments;
    this.vehicle.status = +formData.status;    
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
