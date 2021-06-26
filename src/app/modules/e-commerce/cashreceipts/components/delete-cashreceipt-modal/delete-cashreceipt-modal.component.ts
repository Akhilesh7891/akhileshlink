import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CashReceiptsService } from '../../../_services';

@Component({
  selector: 'app-delete-cashreceipt-modal',
  templateUrl: './delete-cashreceipt-modal.component.html',
  styleUrls: ['./delete-cashreceipt-modal.component.scss']
})
export class DeleteCashReceiptModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private cashreceiptsService: CashReceiptsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteCashReceipt() {
    this.isLoading = true;
    const sb = this.cashreceiptsService.delete(this.id).pipe(
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
