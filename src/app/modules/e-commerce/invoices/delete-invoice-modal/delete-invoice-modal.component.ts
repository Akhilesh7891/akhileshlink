import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { InvoicesService } from '../../_services';

@Component({
  selector: 'app-delete-invoice-modal',
  templateUrl: './delete-invoice-modal.component.html',
  styleUrls: ['./delete-invoice-modal.component.scss']
})
export class DeleteInvoiceModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private invoicesService: InvoicesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteInvoice() {
    this.isLoading = true;
    const sb = this.invoicesService.delete(this.id).pipe(
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
