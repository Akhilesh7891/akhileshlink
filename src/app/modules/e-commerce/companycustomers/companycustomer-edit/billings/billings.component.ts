import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GroupingState,
  ICreateAction,
  IDeleteAction,
  IEditAction,
  IGroupingView,
  ISearchView,
  ISortView,
  PaginatorState,
  SortState,
} from '../../../../../_metronic/shared/crud-table';
import { BillingsService } from '../../../_services';
import { DeleteBillingModalComponent } from './delete-billing-modal/delete-billing-modal.component';
import { EditBillingModalComponent } from './edit-billing-modal/edit-billing-modal.component';

@Component({
  selector: 'app-billings',
  templateUrl: './billings.component.html',
  styleUrls: ['./billings.component.scss'],
})
export class BillingsComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    ISortView,
    IGroupingView,
    ISearchView,
    IEditAction,
    ICreateAction {
  @Input() customerId: number;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public billingsService: BillingsService
  ) {}

  ngOnInit(): void {
    this.searchForm();
    const sb = this.billingsService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.billingsService.patchState({ entityId: this.customerId });
    this.grouping = this.billingsService.grouping;
    this.paginator = this.billingsService.paginator;
    this.sorting = this.billingsService.sorting;
    this.billingsService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  //
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
    this.billingsService.patchState({ searchTerm });
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
    this.billingsService.patchState({ sorting });
  }
  // pagination
  paginate(paginator: PaginatorState) {
    this.billingsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteBillingModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.billingsService.fetch(),
      () => {}
    );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(EditBillingModalComponent,{ size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.customerId = this.customerId;
    modalRef.result.then(() =>
      this.billingsService.fetch(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }
}
