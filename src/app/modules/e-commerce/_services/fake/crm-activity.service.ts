import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { Router } from '@angular/router';
import { CRMActivity } from '../../_models/crm-activity.model';
import { environment } from 'src/environments/environment.prod';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Injectable({
  providedIn: 'root'
})
export class CRMActivityService extends TableService<CRMActivity> implements OnDestroy {
  API_URL = `${environment.apiUrl}/crmActivity`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CRMActivity>> {
    
    return this.http.get<CRMActivity[]>(this.API_URL).pipe(
      map((response: CRMActivity[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<CRMActivity> = {
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

  updateStatusForItems(ids: number[], status: number): Observable<any> {
    return this.http.get<CRMActivity[]>(this.API_URL).pipe(
      map((customers: CRMActivity[]) => {
        return customers.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.Status = status;
          return c;
        });
      }),
      exhaustMap((customers: CRMActivity[]) => {
        const tasks$ = [];
        customers.forEach(customer => {
          tasks$.push(this.update(customer));
        });
        return forkJoin(tasks$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
