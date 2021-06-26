import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryComponent } from './delivery.component';
import { DeliveryPlanComponent } from '../delivery/delivery-plan/delivery-plan.component';
import { DeliveryLoadingComponent } from './delivery-loading/delivery-loading.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: 'delivery-plan',
        component: DeliveryPlanComponent,
      },
      {
        path: 'delivery-loading',
        component: DeliveryLoadingComponent,
      },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}
