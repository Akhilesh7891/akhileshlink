import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Routine extends BaseModel {
  id: number;
  openTimeMon: string;
  openTimeTue: string;
  openTimeWed: string;
  openTimeThur: string;
  openTimeFri: string;
  openTimeSat: string;
  openTimeSun: string;
  closeTimeMon: string;
  closeTimeTue: string;
  closeTimeWed: string;
  closeTimeThur: string;
  closeTimeFri: string;
  closeTimeSat: string;
  closeTimeSun: string;
  lunchTimeMon: string;
  lunchTimeTue: string;
  lunchTimeWed: string;
  lunchTimeThur: string;
  lunchTimeFri: string;
  lunchTimeSat: string;
  lunchTimeSun: string;
  breakTimeMon: string;
  breakTimeTue: string;
  breakTimeWed: string;
  breakTimeThur: string;
  breakTimeFri: string;
  breakTimeSat: string;
  breakTimeSun: string;
}
