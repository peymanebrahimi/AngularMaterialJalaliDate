import {NgModule} from '@angular/core';


import { JalaliMomentDateAdapter } from '../jalali-moment-date-adapter';
import { JALALI_MOMENT_FORMATS } from '../jalali_moment_formats';
import { MAT_DATE_LOCALE_PROVIDER, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

export * from '../jalali-moment-date-adapter';
export * from '../jalali_moment_formats';


@NgModule({
  providers: [
    MAT_DATE_LOCALE_PROVIDER,
    {provide: DateAdapter, useClass: JalaliMomentDateAdapter, deps: [MAT_DATE_LOCALE]}
  ],
})
export class MomentDateModule {}


@NgModule({
  imports: [MomentDateModule],
  providers: [{provide: MAT_DATE_FORMATS, useValue: JALALI_MOMENT_FORMATS}],
})
export class MdMomentDateModule {}
