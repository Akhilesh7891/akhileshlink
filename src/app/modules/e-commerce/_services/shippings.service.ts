import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { CustomerShipping } from '../_models/customer-shipping.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingsService extends TableService<CustomerShipping> {
  API_URL = `${environment.apiUrl}/customershippings`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
