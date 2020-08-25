import { Inject, Optional } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from "jalali-moment";
import { MatMomentDateAdapterOptions, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

export class JalaliMomentDateAdapter extends DateAdapter<moment.Moment> {
  // Note: all of the methods that accept a `Moment` input parameter immediately call `this.clone`
  // on it. This is to ensure that we're working with a `Moment` that has the correct locale setting
  // while avoiding mutating the original object passed to us. Just calling `.locale(...)` on the
  // input would mutate the object.

  private _localeData: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
    private _options?: MatMomentDateAdapterOptions
  ) {
    super();
    this.setLocale(dateLocale || moment.locale("fa"));
  }

  setLocale(locale: string) {
    super.setLocale(locale);

    let momentLocaleData = moment.localeData(locale);
    if (locale === "fa") {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: momentLocaleData.jMonths(),
        shortMonths: momentLocaleData.jMonthsShort(),
        dates: range(31, i =>
          this.createPersianDateFrom3Numbers(1397, 0, i + 1).format("D")
        ),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin()
      };
    } else {
      this._localeData = {
        firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
        longMonths: momentLocaleData.months(),
        shortMonths: momentLocaleData.monthsShort(),
        dates: range(31, i => this.createDate(2017, 0, i + 1).format("D")),
        longDaysOfWeek: momentLocaleData.weekdays(),
        shortDaysOfWeek: momentLocaleData.weekdaysShort(),
        narrowDaysOfWeek: momentLocaleData.weekdaysMin()
      };
    }
  }

  getYear(date: moment.Moment): number {
    if (this.locale === "fa") {
      return this.clone(date).jYear();
    } else {
      return this.clone(date).year();
    }
  }

  getMonth(date: moment.Moment): number {
    if (this.locale === "fa") {
      return this.clone(date).jMonth();
    } else {
      return this.clone(date).month();
    }
  }

  getDate(date: moment.Moment): number {
    if (this.locale === "fa") {
      return this.clone(date).jDate();
    } else {
      return this.clone(date).date();
    }
  }

  getDayOfWeek(date: moment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    return style == "long"
      ? this._localeData.longMonths
      : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    if (style == "long") {
      return this._localeData.longDaysOfWeek;
    }
    if (style == "short") {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: moment.Moment): string {
    if (this.locale === "fa") {
      return this.clone(date)
        .jYear()
        .toString();
    } else {
      return this.clone(date)
        .year()
        .toString();
    }
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: moment.Moment): number {
    if (this.locale === "fa") {
      return this.clone(date).jDaysInMonth();
    } else {
      return this.clone(date).daysInMonth();
    }
  }

  clone(date: moment.Moment): moment.Moment {
    return date.clone().locale(this.locale);
  }

  private createPersianDateFrom3Numbers(year: number, month: number, date: number): moment.Moment {
    let result: moment.Moment;

    if (this._options && this._options.useUtc) {
      result = moment().utc();
    } else {
      result = moment();
    }

    return result
      .jYear(year)
      .jMonth(month)
      .jDate(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .locale("fa");
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    //  console.log('year: ', year, 'month: ', month,'day: ', date); // shamsi
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    let result;
    if (this.locale === "fa") {
      result = this.createPersianDateFrom3Numbers(year, month, date);
    } else {
      result = this._createMoment({ year, month, date }).locale(this.locale);
    }

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): moment.Moment {
    return this._createMoment().locale(this.locale);
  }

  parse(value: any, parseFormat: string | string[]): moment.Moment | null {
    if (value && typeof value == "string") {
      return this._createMoment(value, parseFormat, this.locale);
    }
    return value ? this._createMoment(value).locale(this.locale) : null;
  }

  format(date: moment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error("JalaliMomentDateAdapter: Cannot format invalid date.");
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    if (this.locale === "fa") {
      return this.clone(date).add(years, "jYear");
    } else {
      return this.clone(date).add(years, "years");
    }
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    if (this.locale === "fa") {
      return this.clone(date).add(months, "jmonth");
    } else {
      return this.clone(date).add(months, "month");
    }
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    if (this.locale === "fa") {
      return this.clone(date).add(days, "jDay");
    } else {
      return this.clone(date).add(days, "day");
    }
  }

  /**
   *Gets the RFC 3339 compatible string (https://tools.ietf.org/html/rfc3339) for the given date.
   * This method is used to generate date strings that are compatible with native HTML attributes
   *such as the `min` or `max` attribute of an `<input>`.
   *@param date The date to get the ISO date string for.
   *@returns The ISO date string date string.
   */
  toIso8601(date: moment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: moment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): moment.Moment {
    return moment.invalid();
  }

  /**
   * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
   * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
   * string into null. Returns an invalid date for all other values.
   */

  /**
   * Attempts to deserialize a value to a valid date object. This is different from parsing in that
   * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
   * string). The default implementation does not allow any deserialization, it simply checks that
   * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
   * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
   * support passing values from your backend directly to these properties by overriding this method
   * to also deserialize the format used by your backend.
   * @param value The value to be deserialized into a date object.
   * @returns The deserialized date object, either a valid date, null if the value can be
   *     deserialized into a null date (e.g. the empty string), or an invalid date.
   */
  deserialize(value: any): moment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment(value);
    }
    if (typeof value === "string") {
      if (!value) {
        return null;
      }
      if (this.locale === "fa") {
        date = moment(value).locale("fa");
      } else {
        date = this._createMoment(value).locale(this.locale);
      }
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }


  /** Creates a Moment instance while respecting the current UTC settings. */
  // private _createMoment(...args: any[]): moment.Moment {
  //   return this.options && this.options.useUtc
  //     ? moment.utc(...args)
  //     : moment(...args);
  // }
  private _createMoment(
    date: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    locale?: string,
  ): moment.Moment {
    const { strict, useUtc }: MatMomentDateAdapterOptions = this._options || {};

    return useUtc
      ? moment.utc(date, format, locale, strict)
      : moment(date, format, locale, strict);
  }
}
