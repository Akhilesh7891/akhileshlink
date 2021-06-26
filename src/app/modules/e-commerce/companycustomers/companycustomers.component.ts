// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyCustomersService } from '../_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { DeleteCompanyCustomerModalComponent } from './delete-companycustomer-modal/delete-companycustomer-modal.component';

@Component({
  selector: 'app-companycustomers',
  templateUrl: './companycustomers.component.html',
  styleUrls: ['./companycustomers.component.scss'],
})
export class CompanyCustomersComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public companyCustomerService: CompanyCustomersService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.companyCustomerService.fetch();
    const sb = this.companyCustomerService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.companyCustomerService.grouping;
    this.paginator = this.companyCustomerService.paginator;
    this.sorting = this.companyCustomerService.sorting;
    this.companyCustomerService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const condition = this.filterGroup.get('condition').value;
    if (condition) {
      filter['condition'] = condition;
    }
    this.companyCustomerService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
  we are limiting the amount of server requests emitted to a maximum of one every 150ms
  */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.companyCustomerService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.companyCustomerService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.companyCustomerService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteCompanyCustomerModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.companyCustomerService.fetch(),
      () => { }
    );
  }
}
