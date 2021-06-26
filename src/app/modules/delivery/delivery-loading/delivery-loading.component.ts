// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { DeliveryService } from '../delivery.service';
import { DeliveryLoadingModalComponent } from '../model/delivery-loading-modal/delivery-loading-modal.component';

@Component({
  selector: 'app-delivery-loading',
  templateUrl: './delivery-loading.component.html',
  styleUrls: ['./delivery-loading.component.scss']
})
export class DeliveryLoadingComponent implements OnInit,OnDestroy {

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; 

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public deliveryService: DeliveryService
  ) {
 
   }

   ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.deliveryLoadingData();
    // this.deliveryService.fetch();
    this.grouping = this.deliveryService.grouping;
    this.paginator = this.deliveryService.paginator;
    this.sorting = this.deliveryService.sorting;
    const sb = this.deliveryService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  deliveryBind:any=[];
  deliveryLoadingData(){
    this.deliveryService.getDeliveryLoadingData().subscribe((res:any)=>{
      this.deliveryBind = res;
    })
  }

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
    this.deliveryService.patchState({ filter });
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
    this.deliveryService.patchState({ searchTerm });
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
    this.deliveryService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.deliveryService.patchState({ paginator });
  }


  
  modalId:any;
  deliveryPlanDetails(item:any){
    const modalRef = this.modalService.open(DeliveryLoadingModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = item;
    this.modalId = item;
    this.deliveryService.deliveryId.next(this.modalId);
  }

}
