import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Routine } from '../_models/routine.model';
import { RoutinesService } from '../_services';

const EMPTY_ROUTINE: Routine = {
  id: undefined,
  openTimeMon: '00.00.00',
  openTimeTue: '00.00.00',
  openTimeWed: '00.00.00',
  openTimeThur: '00.00.00',
  openTimeFri: '00.00.00',
  openTimeSat: '00.00.00',
  openTimeSun: '00.00.00',
  closeTimeMon: '00.00.00',
  closeTimeTue: '00.00.00',
  closeTimeWed: '00.00.00',
  closeTimeThur: '00.00.00',
  closeTimeFri: '00.00.00',
  closeTimeSat: '00.00.00',
  closeTimeSun: '00.00.00',
  lunchTimeMon: '00.00.00',
  lunchTimeTue: '00.00.00',
  lunchTimeWed: '00.00.00',
  lunchTimeThur: '00.00.00',
  lunchTimeFri: '00.00.00',
  lunchTimeSat: '00.00.00',
  lunchTimeSun: '00.00.00',
  breakTimeMon: '00.00.00',
  breakTimeTue: '00.00.00',
  breakTimeWed: '00.00.00',
  breakTimeThur: '00.00.00',
  breakTimeFri: '00.00.00',
  breakTimeSat: '00.00.00',
  breakTimeSun: '00.00.00'
};

@Component({
  selector: 'app-routine-edit',
  templateUrl: './routine-edit.component.html',
  styleUrls: ['./routine-edit.component.scss']
})
export class RoutineEditComponent implements OnInit, OnDestroy {
  id: 1;
  routine: Routine;
  previous: Routine;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  routineForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private routineService: RoutinesService,
    private router: Router,
    private route: ActivatedRoute,
    private routineFB: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.routineService.isLoading$;
    this.loadRoutine();
  }

  loadRoutine() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = 1;
        if (this.id || this.id > 0) {
          return this.routineService.getItemById(this.id);
        }
        return of(EMPTY_ROUTINE);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: Routine) => {
      this.routine = res;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.routine) {
      return;
    }

    var formObj = {
      openTimeMon: [this.routine.openTimeMon, Validators.compose([Validators.required])],
      openTimeTue: [this.routine.openTimeTue, Validators.compose([Validators.required])],
      openTimeWed: [this.routine.openTimeWed, Validators.compose([Validators.required])],
      openTimeThur: [this.routine.openTimeThur, Validators.compose([Validators.required])],
      openTimeFri: [this.routine.openTimeFri, Validators.compose([Validators.required])],
      openTimeSat: [this.routine.openTimeSat, Validators.compose([Validators.required])],
      openTimeSun: [this.routine.openTimeSun, Validators.compose([Validators.required])],
      closeTimeMon: [this.routine.closeTimeMon, Validators.compose([Validators.required])],
      closeTimeTue: [this.routine.closeTimeTue, Validators.compose([Validators.required])],
      closeTimeWed: [this.routine.closeTimeWed, Validators.compose([Validators.required])],
      closeTimeThur: [this.routine.closeTimeThur, Validators.compose([Validators.required])],
      closeTimeFri: [this.routine.closeTimeFri, Validators.compose([Validators.required])],
      closeTimeSat: [this.routine.closeTimeSat, Validators.compose([Validators.required])],
      closeTimeSun: [this.routine.closeTimeSun, Validators.compose([Validators.required])],
      lunchTimeMon: [this.routine.lunchTimeMon, Validators.compose([Validators.required])],
      lunchTimeTue: [this.routine.lunchTimeTue, Validators.compose([Validators.required])],
      lunchTimeWed: [this.routine.lunchTimeWed, Validators.compose([Validators.required])],
      lunchTimeThur: [this.routine.lunchTimeThur, Validators.compose([Validators.required])],
      lunchTimeFri: [this.routine.lunchTimeFri, Validators.compose([Validators.required])],
      lunchTimeSat: [this.routine.lunchTimeSat, Validators.compose([Validators.required])],
      lunchTimeSun: [this.routine.lunchTimeSun, Validators.compose([Validators.required])],
      breakTimeMon: [this.routine.breakTimeMon, Validators.compose([Validators.required])],
      breakTimeTue: [this.routine.breakTimeTue, Validators.compose([Validators.required])],
      breakTimeWed: [this.routine.breakTimeWed, Validators.compose([Validators.required])],
      breakTimeThur: [this.routine.breakTimeThur, Validators.compose([Validators.required])],
      breakTimeFri: [this.routine.breakTimeFri, Validators.compose([Validators.required])],
      breakTimeSat: [this.routine.breakTimeSat, Validators.compose([Validators.required])],
      breakTimeSun: [this.routine.breakTimeSun, Validators.compose([Validators.required])]
    }
    this.routineForm = this.routineFB.group(formObj);

  }

  save() {
    this.routineForm.markAllAsTouched();
    if (!this.routineForm.valid) {
      return;
    }
    const formValues = this.routineForm.value;
    this.routine = Object.assign(this.routine, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.routineService.update(this.routine).subscribe(res => this.routine = res);
    //this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.routineService.create(this.routine).subscribe(res => this.routine = res as Routine);
    //this.subscriptions.push(sbCreate);
  }

  ngOnDestroy() {
    //this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.routineForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.routineForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.routineForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.routineForm.controls[controlName];
    return control.dirty || control.touched;
  }

  
}
