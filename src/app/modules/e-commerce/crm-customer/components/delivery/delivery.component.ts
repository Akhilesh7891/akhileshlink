import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CRMActivityService } from '../../../_services';
import { ViewDetailsComponent } from '../view-details/view-details.component';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  id:number;
  constructor(public activityService:CRMActivityService,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.activityService.fetch();
  }
  @Input() set customerId(value: any) {
    if (value != undefined || value != null) {
      this.id = value;
    }
  }

 
  viewDetails(id){
    //redirect details page
    
    const modalRef = this.modalService.open(ViewDetailsComponent, { size: 'lg' });
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.mode = "delivery";
        modalRef.result.then(() =>
          () => { }
        );
      }
}
