import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { CustomerBilling } from '../../_models/customer-billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingsService extends TableService<CustomerBilling> implements OnDestroy {
  API_URL = `${environment.apiUrl}/customerbillings`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CustomerBilling>> {
    return this.http.get<CustomerBilling[]>(this.API_URL).pipe(
      map((response: CustomerBilling[]) => {
        const filteredResult = baseFilter(response.filter(el => el.customerId === tableState.entityId), tableState);
        const result: TableResponseModel<CustomerBilling> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
