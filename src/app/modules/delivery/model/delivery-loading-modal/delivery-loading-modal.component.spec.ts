import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryLoadingModalComponent } from './delivery-loading-modal.component';

describe('DeliveryLoadingModalComponent', () => {
  let component: DeliveryLoadingModalComponent;
  let fixture: ComponentFixture<DeliveryLoadingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryLoadingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryLoadingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
