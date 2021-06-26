import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActivityDeleteComponent } from './crm-activity-delete.component';

describe('CrmActivityDeleteComponent', () => {
  let component: CrmActivityDeleteComponent;
  let fixture: ComponentFixture<CrmActivityDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmActivityDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActivityDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
