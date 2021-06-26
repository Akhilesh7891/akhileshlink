import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { CustomerContact } from '../_models/customer-contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends TableService<CustomerContact> {
  API_URL = `${environment.apiUrl}/customercontacts`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}
