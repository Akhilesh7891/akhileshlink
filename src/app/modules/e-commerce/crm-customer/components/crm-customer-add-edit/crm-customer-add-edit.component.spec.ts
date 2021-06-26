import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCustomerAddEditComponent } from './crm-customer-add-edit.component';

describe('CrmCustomerAddEditComponent', () => {
  let component: CrmCustomerAddEditComponent;
  let fixture: ComponentFixture<CrmCustomerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmCustomerAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCustomerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
