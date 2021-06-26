import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { Leave } from '../../_models/leave.model';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

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
export class LeavesService extends TableService<Leave> implements OnDestroy {
  API_URL = `${environment.apiUrl}/leaves`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Leave>> {
    return this.http.get<Leave[]>(this.API_URL).pipe(
      map((response: Leave[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Leave> = {
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
    return this.http.get<Leave[]>(this.API_URL).pipe(
      map((Leaves: Leave[]) => {
        return Leaves.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((Leaves: Leave[]) => {
        const tasks$ = [];
        Leaves.forEach(Leave => {
          tasks$.push(this.update(Leave));
        });
        return forkJoin(tasks$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
