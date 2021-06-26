import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { OrdersService } from '../../_services';

@Component({
  selector: 'app-delete-order-modal',
  templateUrl: './delete-order-modal.component.html',
  styleUrls: ['./delete-order-modal.component.scss']
})
export class DeleteOrderModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private ordersService: OrdersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteOrder() {
    this.isLoading = true;
    const sb = this.ordersService.delete(this.id).pipe(
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
