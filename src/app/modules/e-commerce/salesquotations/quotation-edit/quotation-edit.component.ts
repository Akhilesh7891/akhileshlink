import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Quotation } from '../../_models/quotation.model';
import { QuotationsService } from '../../_services';

const EMPTY_QUOTATION: Quotation = {
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
  shipCountry: '',
  remarks: '',
  totalDiscount: 0
};

@Component({
  selector: 'app-quotation-edit',
  templateUrl: './quotation-edit.component.html',
  styleUrls: ['./quotation-edit.component.scss']
})
export class QuotationEditComponent implements OnInit, OnDestroy {
  id: number;
  quotation: Quotation;
  previous: Quotation;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  quotationForm: FormGroup;
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
    private quotationService: QuotationsService,
    private router: Router,
    private route: ActivatedRoute,
    private quotationFB: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.quotationService.isLoading$;
    this.loadQuotation();
  }

  loadQuotation() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.quotationService.getItemById(this.id);
        }
        return of(EMPTY_QUOTATION);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Quotation) => {
      if (!res) {
        this.router.navigate(['/ecommerce/salesquotations'], { relativeTo: this.route });
      }

      this.quotation = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.quotation) {
      return;
    }

    var formObj = { 
      customerCode: [this.quotation.customerCode],
      customerName: [this.quotation.customerName],
      contactPerson: [this.quotation.contactPerson],
      mobile: [this.quotation.mobile],
      status: [this.quotation.status],
      docNo: [this.quotation.docNo],
      date: [this.quotation.date],
      payTerms: [this.quotation.payTerms],
      currency: [this.quotation.currency],
      approval: [this.quotation.approval],
      itemList: this.quotationFB.array([this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null })]),
      billAddressCode: [this.quotation.billAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billAddress: [this.quotation.billAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      billCity: [this.quotation.billCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billState: [this.quotation.billState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      billZipCode: [this.quotation.billZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      billCountry: [this.quotation.billCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddressCode: [this.quotation.shipAddressCode, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipAddress: [this.quotation.shipAddress, Validators.compose([Validators.minLength(3), Validators.maxLength(100)])],
      shipCity: [this.quotation.shipCity, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipState: [this.quotation.shipState, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      shipZipCode: [this.quotation.shipZipCode, Validators.compose([Validators.minLength(3), Validators.maxLength(6)])],
      shipCountry: [this.quotation.shipCountry, Validators.compose([Validators.minLength(1), Validators.maxLength(100)])],
      remarks: [this.quotation.remarks, Validators.compose([Validators.minLength(1), Validators.maxLength(200)])],
      totalDiscount:[this.quotation.remarks, Validators.compose([Validators.minLength(1)])]
    }
    this.quotationForm = this.quotationFB.group(formObj);

    console.log("this.quotation.itemList",this.quotation.itemList);

    if(this.quotation && this.quotation.id && this.quotation.id > 0){
      this.mapItemsValues(this.quotation.itemList);
    }

  }

  /* Items fileds value mapping with form control
   * @ param  JSON Array
   */
  mapItemsValues(items: any) {
    var __this = this;
    this.itemList = this.quotationForm.get('itemList') as FormArray;
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
    return this.quotationFB.group({
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
    this.itemList = this.quotationForm.get('itemList') as FormArray;
    this.itemList.push(this.createItem({ 'itemCode': null, 'description': null, 'quantity': null, unit: null, price: null, discount: null, tax: null, total: null }));
  }

  removeItem(index) {
    this.itemList = this.quotationForm.get('itemList') as FormArray;
    this.itemList.removeAt(index);
  }

  getItems(): FormArray {
    return <FormArray>this.quotationForm.controls.itemList;
  }

  save() {
    this.quotationForm.markAllAsTouched();
    if (!this.quotationForm.valid) {
      return;
    }

    const formValues = this.quotationForm.value;
    this.quotation = Object.assign(this.quotation, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.quotationService.update(this.quotation).pipe(
      tap(() => this.router.navigate(['/ecommerce/salesquotations'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.quotation);
      })
    ).subscribe(res => this.quotation = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.quotationService.create(this.quotation).pipe(
      tap(() => this.router.navigate(['/ecommerce/salesquotations'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.quotation);
      })
    ).subscribe(res => this.quotation = res as Quotation);
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
    const control = this.quotationForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.quotationForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.quotationForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.quotationForm.controls[controlName];
    return control.dirty || control.touched;
  }

  totalPrice(index) {
    const items = this.getItems();
    //Appending value into total amount column
    this.itemList  = this.quotationForm.get('itemList') as FormArray;
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

    if(tax && totalPrice){
      totalPrice = this.addTax(totalPrice,tax,quantity);
    }

    //Total amount
    this.itemList.at(index)['controls'].total.patchValue(totalPrice);
    
    if(items && items.value.length > 0){
      this.totalSumAmountBeforeTax = this.totalPriceBeforeTax(items.value,'price','quantity','discount');
      this.totalTax = this.calculateTotalTaxAmount(items.value);
      this.totalAmountAfterTax = Number((Number(this.totalTax)+Number(this.totalSumAmountBeforeTax)).toFixed(2));
    }
    this.discountOnSubTotalAmount(this.quotationForm.get('totalDiscount').value());
    return 0;
  }

  discountOnSubTotalAmount(value){
    let newTotal = this.totalSumAmountBeforeTax;
    if(value){
      this.totalTax = Number((Number(this.calculateDiscount(this.totalTax,Number(value)))).toFixed(2));
      newTotal =  Number(Number(this.calculateDiscount(this.totalSumAmountBeforeTax,Number(value))).toFixed(2));
    }else{
      const items = this.getItems();  
      this.totalTax = this.calculateTotalTaxAmount(items.value);
    }
    this.totalAmountAfterTax = Number(Number(Number(this.totalTax)+Number(newTotal)).toFixed(2));
  }

  calculateDiscount(price,percent){
    let totalPrice    = Number(price);
    let totalPercent  = Number(percent) / 100;
    let totalValue    = totalPrice - (totalPrice * totalPercent);
    return totalValue.toFixed(2);        
  }

  addTax(price,taxRate,quantity){
    let totalPrice    = Number(price);
    let totalPercent  = Number(taxRate) / 100;
    let totalValue    = totalPrice + (totalPrice * totalPercent);
    return totalValue;
  }

  totalPriceBeforeTax(items,keyPrice,keyQuantity = null, keyDiscount = null){
    let total = 0;
    for (var i = 0; i < items.length; i++) {
      let price    = Number(items[i][keyPrice]) && Number(items[i][keyPrice]) > 0 ? Number(items[i][keyPrice]) : 0;
      let quantity = Number(items[i][keyQuantity]) && Number(items[i][keyQuantity]) > 0 ? Number(items[i][keyQuantity]) : 1;
      let rowPrice = price * quantity;
      let discount = Number(items[i][keyDiscount]) && Number(items[i][keyDiscount]) > 0 ? Number(items[i][keyDiscount]) : 0;
      
      if(discount){
        total += Number(this.calculateDiscount(rowPrice,discount));
      }else{
        total += rowPrice;
      }
    }
    return total;     
  }

  calculateTotalTaxAmount(items){
    let totalTaxAmount = 0;
    for (var i = 0; i < items.length; i++) {
      let price    = Number(items[i]['price']) && Number(items[i]['price']) > 0 ? Number(items[i]['price']) : 0;
      let quantity = Number(items[i]['quantity']) && Number(items[i]['quantity']) > 0 ? Number(items[i]['quantity']) : 1;
      let rowPrice = Number(items[i]['discount']) && Number(items[i]['discount']) > 0 ? this.calculateDiscount(price * quantity, Number(items[i]['discount'])) : price * quantity;
      let taxRate  = Number(items[i]['tax']) && Number(items[i]['tax']) > 0 ? Number(items[i]['tax']) : 0;
      if(taxRate){
        let totalPercent  = Number(taxRate) / 100;
        totalTaxAmount += (Number(rowPrice) * totalPercent);
      }
    }
    return totalTaxAmount;
  }

  totalPriceAfterTax(items){

  }
}
