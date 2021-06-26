import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../delivery.service';
@Component({
  selector: 'app-delivery-modal',
  templateUrl: './delivery-modal.component.html',
  styleUrls: ['./delivery-modal.component.scss']
})
export class DeliveryModalComponent implements OnInit {

  deliveryIDData:any;
  constructor(
    public deliveryService: DeliveryService
    ) {
      this.deliveryService.deliveryId.subscribe((res:any)=>{
        this.deliveryIDData = res;
      })
     }

  ngOnInit(): void {
    this.deliveryModalDataBind();
    this.additionalModalDataBind();
  }
  tabs = {
    OrderTAble: 0,
    additionalItems: 1,
       
  };

  activeTabId = this.tabs.OrderTAble;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  deliveryModalBind:any;
  deliveryModalDataBind(){
    this.deliveryService.getDeliveryModalData().subscribe((res:any)=>{
      this.deliveryModalBind = res.filter(x => x.DeliveryPlanCode == this.deliveryIDData);;
    })
  }

  additionalModalBind:any;
  additionalModalDataBind(){
    this.deliveryService.getadditionalModalData().subscribe((res:any)=>{
      this.additionalModalBind = res.filter(x => x.DeliveryPlanCode == this.deliveryIDData);;
    })
  }

  
  

}
