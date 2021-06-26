import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { CustomerShipping } from '../../_models/customer-shipping.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingsService extends TableService<CustomerShipping> implements OnDestroy {
  API_URL = `${environment.apiUrl}/customershippings`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CustomerShipping>> {
    return this.http.get<CustomerShipping[]>(this.API_URL).pipe(
      map((response: CustomerShipping[]) => {
        const filteredResult = baseFilter(response.filter(el => el.customerId === tableState.entityId), tableState);
        const result: TableResponseModel<CustomerShipping> = {
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
