import { Inject, Injectable } from '@angular/core';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { CompanyCustomer } from '../_models/companycustomer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomersService extends TableService<CompanyCustomer> {
  API_URL = `${environment.apiUrl}/companycustomers`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
