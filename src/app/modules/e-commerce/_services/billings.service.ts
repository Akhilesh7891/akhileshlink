import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { CustomerBilling } from '../_models/customer-billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingsService extends TableService<CustomerBilling> {
  API_URL = `${environment.apiUrl}/customerbillings`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
