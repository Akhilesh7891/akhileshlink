import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Order } from '../../_models/order.model';
import { OrdersService } from '../../_services';

const EMPTY_QUOTATION: Order = {
  id: undefined,
  customerCode: '',
  customerName: '',
  contactPerson: '',
  mobile: 0,
  status: 0,
  docNo: '',
  date: new Date(),
  payTerms: '',
  currency: '',
  approval: '', //Droft/Approved
  itemList: [],
  billAddressCode: '',
  billAddress: '',
  billCity: '',
  billState: '',
  billZipCode: 0,
  billCountry: '',
  shipAddressCode: '',
  shipAddress: '',
  shipCity: '',
  shipState: '',
  shipZipCode: 0,
  shipCountry: ''
};

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit, OnDestroy {
  id: number;
  order: Order;
  previous: Order;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  orderForm: FormGroup;
  itemList: FormArray;
  tabs = {
    ITEM_TAB: 0,
    BILLING_TAB: 1,
    SHIPPING_TAB: 2,    
  };
  activeTabId = this.tabs.ITEM_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];
  public totalSumAmountBeforeTax: number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public totalAmountAfterTax: number = 0;

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private orderFB: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.orderService.isLoading$;
    this.loadOrder();
  }

  loadOrder() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.orderService.getItemById(this.id);
        }
        return of(EMPTY_QUOTATION);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Order) => {
      if (!res) {
        this.router.navigate(['/ecommerce/salesorders'], { relativeTo: this.route });
      }

      this.order = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.order) {
      return;
    }

    var formObj = { 
      customerCode: [this.order.customerCode],
      customerName: [this.order.customerName],
      contactPerson: [this.order.contactPerson],
      mobile: [this.order.mobile],
      status: [this.order.status],
      docNo: [this.order.docNo],
      date: [this.order.date],
      payTerms: [this.order.payTerms],
      currency: [this.order.currency],
      approval: [this.order.approval],
      itemList: this.orderFB.array([this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null })]),
      billAddressCode: [this.order.billAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billAddress: [this.order.billAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      billCity: [this.order.billCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billState: [this.order.billState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billZipCode: [this.order.billZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      billCountry: [this.order.billCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddressCode: [this.order.shipAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddress: [this.order.shipAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      shipCity: [this.order.shipCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipState: [this.order.shipState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipZipCode: [this.order.shipZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      shipCountry: [this.order.shipCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
    }
    this.orderForm = this.orderFB.group(formObj);

    console.log("this.order.itemList",this.order.itemList);

    if(this.order && this.order.id && this.order.id > 0){
      this.mapItemsValues(this.order.itemList);
    }

  }

  /* Items fileds value mapping with form control
   * @ param  JSON Array
   */
  mapItemsValues(items: any) {
    var __this = this;
    this.itemList = this.orderForm.get('itemList') as FormArray;
    items.forEach(function (obj, index) {
      if (index >= __this.itemList.length) {
          __this.itemList.push(__this.createItem({ 'itemCode': obj.itemCode, 'description': obj.description, 'quantity': obj.quantity, 'unit': obj.unit, 'price': obj.price, 'discount': obj.discount, 'tax': obj.tax, 'total': obj.total}));
      } else {
          __this.itemList.at(index)['controls'].itemCode.patchValue(obj.itemCode);
          __this.itemList.at(index)['controls'].description.patchValue(obj.description);
          __this.itemList.at(index)['controls'].quantity.patchValue(obj.quantity);
          __this.itemList.at(index)['controls'].unit.patchValue(obj.unit);
          __this.itemList.at(index)['controls'].price.patchValue(obj.price);
          __this.itemList.at(index)['controls'].discount.patchValue(obj.discount);
          __this.itemList.at(index)['controls'].tax.patchValue(obj.tax);
          __this.itemList.at(index)['controls'].total.patchValue(obj.total);
      }
    });
  }

  /* Create Alternate User */
  createItem(data: any): FormGroup {
    return this.orderFB.group({
      itemCode: [data.itemCode, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(10)])]],
      description: [data.description, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(100)])]],
      quantity: [data.quantity, [Validators.compose([Validators.required,Validators.min(1), Validators.max(100)])]],
      unit: [data.unit, [Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(5)])]],
      price: [data.price, [Validators.compose([Validators.required,Validators.min(1), Validators.max(100)])]],
      discount: [data.discount,[Validators.compose([Validators.min(1), Validators.max(100)])]],
      tax: [data.tax, [Validators.compose([Validators.min(1), Validators.max(100)])]],
      total: [data.total,[Validators.compose([Validators.required])]]
    });
  }

  addItem(): void {
    this.itemList = this.orderForm.get('itemList') as FormArray;
    this.itemList.push(this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null }));
  }

  removeItem(index) {
    this.itemList = this.orderForm.get('itemList') as FormArray;
    this.itemList.removeAt(index);
  }

  getItems(): FormArray {
    return <FormArray>this.orderForm.controls.itemList;
  }

  save() {
    this.orderForm.markAllAsTouched();
    if (!this.orderForm.valid) {
      return;
    }

    const formValues = this.orderForm.value;
    this.order = Object.assign(this.order, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.orderService.update(this.order).pipe(
      tap(() => this.router.navigate(['/ecommerce/salesorders'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.order);
      })
    ).subscribe(res => this.order = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.orderService.create(this.order).pipe(
      tap(() => this.router.navigate(['/ecommerce/salesorders'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.order);
      })
    ).subscribe(res => this.order = res as Order);
    this.subscriptions.push(sbCreate);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.orderForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.orderForm.controls[controlName];
    return control.dirty || control.touched;
  }

  totalPrice(index) {
    const items = this.getItems();    
    //Appending value into total amount column
    this.itemList  = this.orderForm.get('itemList') as FormArray;
    const quantity = parseInt(this.itemList.at(index).get('quantity').value) ? parseInt(this.itemList.at(index).get('quantity').value) : 1;
    const discount = Number(this.itemList.at(index).get('discount').value) ? Number(this.itemList.at(index).get('discount').value): 0;
    const tax      = Number(this.itemList.at(index).get('tax').value) ? Number(this.itemList.at(index).get('tax').value) : 0;
    const price    = Number(this.itemList.at(index).get('price').value) ? Number(this.itemList.at(index).get('price').value) : 0;
    let totalPrice = price;
    
    if(quantity && price){
      totalPrice = quantity*price;
    }

    if(discount && totalPrice){
      totalPrice = Number(this.calculateDiscount(totalPrice,discount));
    }

    if(tax && totalPrice && quantity){
      totalPrice = this.addTax(totalPrice,tax,quantity);
    }

    //Total amount
    this.itemList.at(index)['controls'].total.patchValue(totalPrice);
    
    if(items && items.value.length > 0){
      this.totalSumAmountBeforeTax = this.sumArrayByKey(items.value,'price','quantity');
      this.totalDiscount = this.sumArrayByKey(items.value,'discount');
      this.totalTax = this.sumArrayByKey(items.value,'tax');
      this.totalAmountAfterTax = this.sumArrayByKey(items.value,'total');
    }
    return 0;
  }


  calculateDiscount(price,percent){
    console.log(price,percent);
    let totalPrice    = Number(price);
    let totalPercent  = Number(percent) / 100;
    let totalValue    = totalPrice - (totalPrice * totalPercent);
    return totalValue.toFixed(2);        
  }

  addTax(price,taxRate,quantity){
    const tax = price * quantity * taxRate
    const totalPrice = price * quantity + tax;
    return totalPrice;
  }

  sumArrayByKey(jsonArray,keyName,keyQuantity = null){    
    let total = 0;
    for (var i = 0; i < jsonArray.length; i++) {
      if(keyQuantity){
        total += Number(jsonArray[i][keyName])*Number(jsonArray[i][keyQuantity]);
      }else{
        total += Number(jsonArray[i][keyName]);
      }
    }

    if(total && total > 0)
      return total;
    else
      return 0;
  }
}
