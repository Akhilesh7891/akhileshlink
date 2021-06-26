import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActivityAddEditComponent } from './crm-activity-add-edit.component';

describe('CrmActivityAddEditComponent', () => {
  let component: CrmActivityAddEditComponent;
  let fixture: ComponentFixture<CrmActivityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmActivityAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActivityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
