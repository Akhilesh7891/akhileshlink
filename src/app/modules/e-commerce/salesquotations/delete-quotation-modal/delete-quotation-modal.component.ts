import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { QuotationsService } from '../../_services';

@Component({
  selector: 'app-delete-quotation-modal',
  templateUrl: './delete-quotation-modal.component.html',
  styleUrls: ['./delete-quotation-modal.component.scss']
})
export class DeleteQuotationModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private quotationsService: QuotationsService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteQuotation() {
    this.isLoading = true;
    const sb = this.quotationsService.delete(this.id).pipe(
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
