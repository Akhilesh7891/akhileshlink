import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryLoadingComponent } from './delivery-loading.component';

describe('DeliveryLoadingComponent', () => {
  let component: DeliveryLoadingComponent;
  let fixture: ComponentFixture<DeliveryLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
