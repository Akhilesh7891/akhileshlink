import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Item } from '../../../_models/item.model';
import { ItemsService } from '../../../_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_ROLE: Item = {
  id: undefined,
  itemCode: '',
  itemName: '',
  description: '',
  itemGroup: '',
  salesItem: 0, // yes/No
  inventory: 0, // yes/no
  inStock: 0,
  committed: 0, // This will show Qty Ordered by Customers
  onOrder: 0, // – This will show Qty Ordered from Vendors
  salesUnit: 0, //Weight
  salesUoM: 0, //- Weight
  salesUnitVolume: '',
  salesUoMVolume: '',
  retailPrice: '',
  wholesalePrice: '',
  noOfItems: 0,  //No. of Items per Sales Unit
  itemRemarks: '',
  picture: '',
  createdAt: '',
  updatedAt: '',
  manageBatchNo: 0,// [Yes/No]
  activeFrom: new Date(),// [Date]
  activeTo: new Date(), // [Date]
};

@Component({
  selector: 'app-view-item-modal',
  templateUrl: './view-item-modal.component.html',
  styleUrls: ['./view-item-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ViewItemModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  item: Item;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private itemsService: ItemsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.itemsService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.item = EMPTY_ROLE;
      this.loadForm();
    } else {
      const sb = this.itemsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROLE);
        })
      ).subscribe((item: Item) => {
        this.item = item;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
    itemCode: [this.item.itemCode],
    itemName: [this.item.itemName],
    description: [this.item.description],
    itemGroup: [this.item.itemGroup],
    salesItem: [this.item.salesItem], // yes/No
    inventory: [this.item.inventory], // yes/no
    inStock: [this.item.inStock],
    committed: [this.item.committed], // This will show Qty Ordered by Customers
    onOrder: [this.item.onOrder], // – This will show Qty Ordered from Vendors
    salesUnit: [this.item.salesUnit], //Weight
    salesUoM: [this.item.salesUoM], //- Weight
    salesUnitVolume: [this.item.salesUnitVolume],
    salesUoMVolume: [this.item.salesUoMVolume],
    retailPrice: [this.item.retailPrice],
    wholesalePrice: [this.item.wholesalePrice],
    noOfItems: [this.item.noOfItems], //No. of Items per Sales Unit
    itemRemarks: [this.item.itemRemarks],
    picture: [this.item.picture],
    createdAt: [this.item.createdAt],
    updatedAt: [this.item.updatedAt],
    manageBatchNo: [this.item.manageBatchNo], // [Yes/No]
    activeFrom: [this.item.activeFrom],// [Date]
    activeTo: [this.item.activeTo], // [Date]
    });
  }

  create() {
    const sbCreate = this.itemsService.create(this.item).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.item);
      }),
    ).subscribe((res: Item) => this.item = res);
    this.subscriptions.push(sbCreate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
