import { Inject, Injectable } from '@angular/core';
import { TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Employee } from '../_models/employee.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService extends TableService<Employee> {
  API_URL = `${environment.apiUrl}/employees`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
}

