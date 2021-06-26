import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { ExpenseTypesService } from '../../../_services';

@Component({
  selector: 'app-delete-expensetype-modal',
  templateUrl: './delete-expensetype-modal.component.html',
  styleUrls: ['./delete-expensetype-modal.component.scss']
})
export class DeleteExpenseTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private expensetypesService: ExpenseTypesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteExpenseType() {
    this.isLoading = true;
    const sb = this.expensetypesService.delete(this.id).pipe(
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
