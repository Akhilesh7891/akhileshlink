import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Invoice } from '../../_models/invoice.model';
import { InvoicesService } from '../../_services';

const EMPTY_INVIOCE: Invoice = {
  id: undefined,
  orderCode: '',
  collectCash: '', //Yes/No
  amount: 0,
  location: '',
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
  shipCountry: '',
  remarks: ''
};

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit, OnDestroy {
  id: number;
  invoice: Invoice;
  previous: Invoice;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  invoiceForm: FormGroup;
  itemList: FormArray;
  tabs = {
    ITEM_TAB: 0,
    BILLING_TAB: 1,
    SHIPPING_TAB: 2,
    REMARKS_TAB: 3
  };
  activeTabId = this.tabs.ITEM_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];
  public totalSumAmountBeforeTax: number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public totalAmountAfterTax: number = 0;

  constructor(
    private invoiceService: InvoicesService,
    private router: Router,
    private route: ActivatedRoute,
    private invoiceFB: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.invoiceService.isLoading$;
    this.loadInvoice();
  }

  loadInvoice() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.invoiceService.getItemById(this.id);
        }
        return of(EMPTY_INVIOCE);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Invoice) => {
      if (!res) {
        this.router.navigate(['/ecommerce/invoices'], { relativeTo: this.route });
      }

      this.invoice = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.invoice) {
      return;
    }

    var formObj = { 
      customerCode: [this.invoice.customerCode],
      customerName: [this.invoice.customerName],
      contactPerson: [this.invoice.contactPerson],
      mobile: [this.invoice.mobile],
      status: [this.invoice.status],
      docNo: [this.invoice.docNo],
      date: [this.invoice.date],
      payTerms: [this.invoice.payTerms],
      currency: [this.invoice.currency],
      approval: [this.invoice.approval],
      orderCode: [this.invoice.orderCode],
      collectCash: [this.invoice.collectCash],
      amount: [this.invoice.amount],
      location: [this.invoice.location],
      itemList: this.invoiceFB.array([this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null })]),
      billAddressCode: [this.invoice.billAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billAddress: [this.invoice.billAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      billCity: [this.invoice.billCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billState: [this.invoice.billState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billZipCode: [this.invoice.billZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      billCountry: [this.invoice.billCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddressCode: [this.invoice.shipAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddress: [this.invoice.shipAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      shipCity: [this.invoice.shipCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipState: [this.invoice.shipState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipZipCode: [this.invoice.shipZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      shipCountry: [this.invoice.shipCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      remarks: [this.invoice.remarks, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
    }
    this.invoiceForm = this.invoiceFB.group(formObj);
    if(this.invoice && this.invoice.id && this.invoice.id > 0){
      this.mapItemsValues(this.invoice.itemList);
    }

  }

  /* Items fileds value mapping with form control
   * @ param  JSON Array
   */
  mapItemsValues(items: any) {
    var __this = this;
    this.itemList = this.invoiceForm.get('itemList') as FormArray;
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
    return this.invoiceFB.group({
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
    this.itemList = this.invoiceForm.get('itemList') as FormArray;
    this.itemList.push(this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null }));
  }

  removeItem(index) {
    this.itemList = this.invoiceForm.get('itemList') as FormArray;
    this.itemList.removeAt(index);
  }

  getItems(): FormArray {
    return <FormArray>this.invoiceForm.controls.itemList;
  }

  save() {
    this.invoiceForm.markAllAsTouched();
    if (!this.invoiceForm.valid) {
      return;
    }

    const formValues = this.invoiceForm.value;
    this.invoice = Object.assign(this.invoice, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.invoiceService.update(this.invoice).pipe(
      tap(() => this.router.navigate(['/ecommerce/invoices'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.invoice);
      })
    ).subscribe(res => this.invoice = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.invoiceService.create(this.invoice).pipe(
      tap(() => this.router.navigate(['/ecommerce/invoices'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.invoice);
      })
    ).subscribe(res => this.invoice = res as Invoice);
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
    const control = this.invoiceForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.invoiceForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.invoiceForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.invoiceForm.controls[controlName];
    return control.dirty || control.touched;
  }

  totalPrice(index) {
    const items = this.getItems();    
    //Appending value into total amount column
    this.itemList  = this.invoiceForm.get('itemList') as FormArray;
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
