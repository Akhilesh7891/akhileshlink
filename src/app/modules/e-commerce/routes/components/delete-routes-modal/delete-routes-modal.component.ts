import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { RoutesService } from '../../../_services';

@Component({
  selector: 'app-delete-routes-modal',
  templateUrl: './delete-routes-modal.component.html',
  styleUrls: ['./delete-routes-modal.component.scss']
})
export class DeleteRoutesModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private routesService: RoutesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteRoutes() {
    this.isLoading = true;
    const sb = this.routesService.delete(this.id).pipe(
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
