import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCustomerDeleteComponent } from './crm-customer-delete.component';

describe('CrmCustomerDeleteComponent', () => {
  let component: CrmCustomerDeleteComponent;
  let fixture: ComponentFixture<CrmCustomerDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmCustomerDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCustomerDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
