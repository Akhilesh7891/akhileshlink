import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryRoutingModule } from './delivery-routing.module';

import { DeliveryComponent } from './delivery.component';
import { DeliveryPlanComponent } from '../delivery/delivery-plan/delivery-plan.component';
import { DeliveryModalComponent } from './model/delivery-modal/delivery-modal.component';
import { DeliveryLoadingComponent } from './delivery-loading/delivery-loading.component';
import { DeliveryLoadingModalComponent } from './model/delivery-loading-modal/delivery-loading-modal.component';

@NgModule({
  declarations: [
    DeliveryComponent,
    DeliveryPlanComponent,
    DeliveryModalComponent,
    DeliveryLoadingComponent,
    DeliveryLoadingModalComponent

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DeliveryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule
  ],
  entryComponents: [
    DeliveryComponent,
    DeliveryPlanComponent
  ]
})
export class DeliveryModule {}
