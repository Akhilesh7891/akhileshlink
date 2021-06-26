import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { CustomerContact } from '../../_models/customer-contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends TableService<CustomerContact> implements OnDestroy {
  API_URL = `${environment.apiUrl}/customercontacts`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CustomerContact>> {
    return this.http.get<CustomerContact[]>(this.API_URL).pipe(
      map((response: CustomerContact[]) => {
        const filteredResult = baseFilter(response.filter(el => el.customerId === tableState.entityId), tableState);
        const result: TableResponseModel<CustomerContact> = {
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
