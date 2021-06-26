import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../../../_metronic/shared/crud-table';
import { CRMActivityService } from '../../../_services/fake/crm-activity.service';
import { CrmActivityAddEditComponent } from '../../../crm-activity/components/crm-activity-add-edit/crm-activity-add-edit.component';
import { CrmActivityDeleteComponent } from '../../../crm-activity/components/crm-activity-delete/crm-activity-delete.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements 
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
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
  id: number;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  
  
    
    constructor(
      private fb: FormBuilder,
      private modalService: NgbModal,
      public activityService: CRMActivityService
    ) { }
    updateStatusForSelected(): void {
      throw new Error('Method not implemented.');
    }
    fetchSelected(): void {
      throw new Error('Method not implemented.');
    }
    deleteSelected(): void {
      throw new Error('Method not implemented.');
    }
  
    // angular lifecircle hooks
    ngOnInit(): void {
      this.filterForm();
      this.searchForm();
     this.activityService.fetch();
      this.grouping = this.activityService.grouping;
      this.paginator = this.activityService.paginator;
      this.sorting = this.activityService.sorting;
      const sb = this.activityService.isLoading$.subscribe(res => this.isLoading = res);
      this.subscriptions.push(sb);
    }

    @Input() set customerId(value: any) {
      if (value != undefined || value != null) {
        this.id = value;
      }
    }
    ngOnDestroy() {
      this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    
  viewActivity(id: number) {
    debugger
    const modalRef = this.modalService.open(CrmActivityAddEditComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.mode = "View";
    modalRef.result.then(() =>
     // this.activityService.fetch(),
      () => { }
    );
  }
  
    // filtration
    filterForm() {
      this.filterGroup = this.fb.group({
        status: [''],
        type: [''],
        searchTerm: [''],
      });
      this.subscriptions.push(
        this.filterGroup.controls.status.valueChanges.subscribe(() =>
          this.filter()
        )
      );
      this.subscriptions.push(
        this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
      );
    }
  
    filter() {
      const filter = {};
      const status = this.filterGroup.get('status').value;
      if (status) {
        filter['status'] = status;
      }
  
      const type = this.filterGroup.get('type').value;
      if (type) {
        filter['type'] = type;
      }
      this.activityService.patchState({ filter });
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
      this.activityService.patchState({ searchTerm });
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
      this.activityService.patchState({ sorting });
    }
  
    // pagination
    paginate(paginator: PaginatorState) {
      this.activityService.patchState({ paginator });
    }
  
    // form actions
    create() {
      this.edit(undefined);
    }
  
    edit(id: number) {
      debugger
      const modalRef = this.modalService.open(CrmActivityAddEditComponent, { size: 'lg' });
      modalRef.componentInstance.id = id;
      modalRef.result.then(() =>
        this.activityService.fetch(),
        () => { }
      );
    }
  
    delete(id: number) {
      const modalRef = this.modalService.open(CrmActivityDeleteComponent);
      modalRef.componentInstance.id = id;
      modalRef.result.then(() => this.activityService.fetch(), () => { });
    }
  
  }
