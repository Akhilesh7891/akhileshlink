import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../delivery.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-delivery-loading-modal',
  templateUrl: './delivery-loading-modal.component.html',
  styleUrls: ['./delivery-loading-modal.component.scss']
})
export class DeliveryLoadingModalComponent implements OnInit {

  deliveryIDData:any;
  formGroup: FormGroup;
  minDate = new Date();
  constructor(
    private fb: FormBuilder,
    public deliveryService: DeliveryService
    ) {
      this.deliveryService.deliveryId.subscribe((res:any)=>{
        this.deliveryIDData = res;
      })
     }

  ngOnInit(): void {
    this.deliveryModalDataBind();
    this.loadForm();
  }

  loadingForm:any;
  loadForm() {
    
    this.formGroup = this.fb.group({
      loadingDate: '',
      loadingTime: ''
    });
  }

  additionalModalBind:any;
  deliveryModalDataBind(){
    this.deliveryService.getadditionalModalData().subscribe((res:any)=>{
      this.additionalModalBind = res.filter(x => x.DeliveryPlanCode == this.deliveryIDData);;
    })
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    const formValues = this.formGroup.value;
    this.loadingForm = Object.assign(this.loadingForm, formValues);
  }

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
