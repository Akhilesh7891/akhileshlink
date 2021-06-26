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
import { ContactsService } from '../../../_services';
import { DeleteContactModalComponent } from './delete-contact-modal/delete-contact-modal.component';
import { EditContactModalComponent } from './edit-contact-modal/edit-contact-modal.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent
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
    public contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.searchForm();
    const sb = this.contactsService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.contactsService.patchState({ entityId: this.customerId });
    this.grouping = this.contactsService.grouping;
    this.paginator = this.contactsService.paginator;
    this.sorting = this.contactsService.sorting;
    this.contactsService.fetch();
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
    this.contactsService.patchState({ searchTerm });
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
    this.contactsService.patchState({ sorting });
  }
  // pagination
  paginate(paginator: PaginatorState) {
    this.contactsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteContactModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.contactsService.fetch(),
      () => {}
    );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(EditContactModalComponent,{ size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.customerId = this.customerId;
    modalRef.result.then(() =>
      this.contactsService.fetch(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }
}
