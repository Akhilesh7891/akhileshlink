import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { ContactsService } from '../../../../_services';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../../_metronic/core';
import { CustomerContact } from '../../../../_models/customer-contact.model';
import { catchError, first, tap } from 'rxjs/operators';

const EMPTY_REMARK: CustomerContact = {
  id: undefined,
  customerId: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phone: 0,
};

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditContactModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() customerId: number;
  isLoading$;
  contact: CustomerContact;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private contactsService: ContactsService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.contactsService.isLoading$;
    this.loadRemarks();
  }

  loadRemarks() {
    if (!this.id) {
      this.contact = EMPTY_REMARK;
      this.contact.customerId = this.customerId;
      this.loadForm();
    } else {
      const sb = this.contactsService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          const empty = EMPTY_REMARK;
          empty.customerId = this.customerId;
          return of(empty);
        })
      ).subscribe((contact: CustomerContact) => {
        this.contact = contact;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {

    console.log('this.contact',this.contact)


    this.formGroup = this.fb.group({
      firstName: [this.contact.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.contact.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.contact.email, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      phone: [this.contact.phone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      customerId: [this.contact.customerId]
    });
  }

  save() {
    this.prepareContact();
    if (this.contact.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.contactsService.update(this.contact).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.contact);
      }),
    ).subscribe(res => this.contact = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    
    console.log(this.contact);
    
    const sbCreate = this.contactsService.create(this.contact).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.contact);
      }),
    ).subscribe((res: CustomerContact) => this.contact = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareContact() {
    const formData = this.formGroup.value;
    this.contact.customerId = this.customerId;
    this.contact.firstName = formData.firstName;
    this.contact.lastName = formData.lastName;
    this.contact.email = formData.email;
    this.contact.phone = formData.phone;
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
