import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { VehiclesService } from '../../../_services';

@Component({
  selector: 'app-delete-vehicle-modal',
  templateUrl: './delete-vehicle-modal.component.html',
  styleUrls: ['./delete-vehicle-modal.component.scss']
})
export class DeleteVehicleModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private vehiclesService: VehiclesService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteVehicle() {
    this.isLoading = true;
    const sb = this.vehiclesService.delete(this.id).pipe(
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
