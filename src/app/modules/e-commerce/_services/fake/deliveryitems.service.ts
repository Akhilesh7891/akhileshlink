import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { DeliveryItem } from '../../_models/deliveryitem.model';
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
export class DeliveryItemsService extends TableService<DeliveryItem> implements OnDestroy {
  API_URL = `${environment.apiUrl}/deliveryitems`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<DeliveryItem>> {
    return this.http.get<DeliveryItem[]>(this.API_URL).pipe(
      map((response: DeliveryItem[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<DeliveryItem> = {
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
    return this.http.get<DeliveryItem[]>(this.API_URL).pipe(
      map((DeliveryItems: DeliveryItem[]) => {
        return DeliveryItems.filter(c => ids.indexOf(c.id) > -1).map(c => {
          c.status = status;
          return c;
        });
      }),
      exhaustMap((DeliveryItems: DeliveryItem[]) => {
        const tasks$ = [];
        DeliveryItems.forEach(DeliveryItem => {
          tasks$.push(this.update(DeliveryItem));
        });
        return forkJoin(tasks$);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
