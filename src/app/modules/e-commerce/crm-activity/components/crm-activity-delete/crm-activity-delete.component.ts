import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CRMActivityService } from '../../../_services';

@Component({
  selector: 'app-crm-activity-delete',
  templateUrl: './crm-activity-delete.component.html',
  styleUrls: ['./crm-activity-delete.component.scss']
})
export class CrmActivityDeleteComponent implements OnInit {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private svc: CRMActivityService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteActivity(){
    this.isLoading = true;
    const sb = this.svc.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
