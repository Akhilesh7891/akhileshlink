  import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  import { of, Subscription } from 'rxjs';
  import { catchError, first, tap } from 'rxjs/operators';
  import { CRMActivity } from '../../../_models/crm-activity.model';
  import { CRMActivityService, CustomersService } from '../../../_services';
  
  const EMPTY_ACTIVITY : CRMActivity = {
    id:undefined,
    ActivityCode: '',
    ActivityDate:undefined,
    ActivityType:'',
    AssignTo: '',
    StartDate: undefined,
    Subject:'',
    MeetingLocation:'',
    Remark: '',
    Attachment: '',
    CustomerCode: '',
    CustomerName:'',
    ContactPerson:'',
    MobileNumber:undefined,
    EndDate: undefined,
    Status:undefined
  };
  
  @Component({
    selector: 'app-crm-customer-add-edit',
    templateUrl: './crm-customer-add-edit.component.html',
    styleUrls: ['./crm-customer-add-edit.component.scss']
  })
  export class CrmCustomerAddEditComponent implements OnInit {
    formGroup: FormGroup;
    crmActivity: CRMActivity;
    @Input() id: number;
    ddlCustomer=[];
    private subscriptions: Subscription[] = [];
    constructor(
      private crmSvc: CRMActivityService,
      public modal: NgbActiveModal,
      private fb: FormBuilder,
      public customerService: CustomersService,
      private cd:ChangeDetectorRef
  
  
    ) { }
  
    ngOnInit(): void {
      debugger
      this.loadActivity();
      this.customerService.fetch();
    }
    ngOnDestroy(){
      
     
    }
   
  loadForm(){
    debugger
    this.formGroup = this.fb.group({
      ActivityCode: [this.crmActivity.ActivityCode,  Validators.compose([Validators.required])],
      ActivityDate: [(this.crmActivity.ActivityDate),  Validators.compose([Validators.required])],
      ActivityType: [this.crmActivity.ActivityType,  Validators.compose([Validators.required])],
      AssignTo: [this.crmActivity.AssignTo,  Validators.compose([Validators.required])],
      StartDate: [(this.crmActivity.StartDate),  Validators.compose([Validators.required])],
      Subject: [this.crmActivity.Subject,  Validators.compose([Validators.required])],
      MeetingLocation: [this.crmActivity.MeetingLocation,  Validators.compose([Validators.required])],
      Remark: [this.crmActivity.Remark,  Validators.compose([Validators.required])],
      Attachment: [this.crmActivity.Attachment,  Validators.compose([Validators.required])],
      CustomerCode: [this.crmActivity.CustomerCode,  Validators.compose([Validators.required])],
      CustomerName: [this.crmActivity.CustomerName,  Validators.compose([Validators.required])],
      ContactPerson: [this.crmActivity.ContactPerson,  Validators.compose([Validators.required])],
      MobileNumber: [this.crmActivity.MobileNumber,  Validators.compose([Validators.required])],
      EndDate: [(this.crmActivity.EndDate),  Validators.compose([Validators.required])],
      id:this.crmActivity.id,
    });
   
  }
    save(){
      debugger
      this.prepareForm();
      if (this.crmActivity.id) {
        this.edit();
      } else {
        this.create();
      }
    }
  
    edit() {
      debugger
      const sbUpdate = this.crmSvc.update(this.crmActivity).pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.crmActivity);
        }),
      ).subscribe(res => this.crmActivity = res);
      this.subscriptions.push(sbUpdate);
    }
  
    create() {
      debugger
      const sbCreate = this.crmSvc.create(this.crmActivity).pipe(
        tap(() => {
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.crmActivity);
        }),
      ).subscribe((res: CRMActivity) => this.crmActivity = res);
      this.subscriptions.push(sbCreate);
    }
  
    private prepareForm() {
     this.crmActivity=this.formGroup.value;
    }
    loadActivity() {
      
      if (!this.id) {
        this.crmActivity = EMPTY_ACTIVITY;
        this.loadForm();
      } else {
        const sb = this.crmSvc.getItemById(this.id).pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(EMPTY_ACTIVITY);
          })
        ).subscribe((customer: CRMActivity) => {
          this.crmActivity = customer;
          this.loadForm();
        });
        this.subscriptions.push(sb);
      }
    }
  
  }
  