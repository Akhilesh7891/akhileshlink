import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../_metronic/shared/crud-table';
import { LeaveRequest } from '../_models/leaverequest.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestsService extends TableService<LeaveRequest> implements OnDestroy {
  API_URL = `${environment.apiUrl}/leaverequests`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
