import { LOCALE_ID } from "@angular/core";
import { async, inject, TestBed } from "@angular/core/testing";
import {
  DateAdapter,
  //   DEC,
  //   FEB,
  //   JAN,
  //   MAR,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import * as moment from "jalali-moment";
import { MomentDateModule, JalaliMomentDateAdapter } from "./index";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

const First_Month = 0,
  FEB = 1,
  MAR = 2,
  APR = 3,
  AUG = 7,
  SEP = 8,
  OCT = 9,
  DEC = 11;

describe("Jalali MomentDateAdapter", () => {
  let adapter: JalaliMomentDateAdapter;
  let assertValidDate: (d: moment.Moment | null, valid: boolean) => void;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentDateModule]
    }).compileComponents();
  }));

  beforeEach(inject([DateAdapter], (dateAdapter: JalaliMomentDateAdapter) => {
    moment.locale("fa");
    adapter = dateAdapter;
    adapter.setLocale("fa");

    assertValidDate = (d: moment.Moment | null, valid: boolean) => {
      expect(adapter.isDateInstance(d)).not.toBeNull(
        `Expected ${d} to be a date instance`
      );
      expect(adapter.isValid(d!)).toBe(
        valid,
        `Expected ${d} to be ${valid ? "valid" : "invalid"},` +
        ` but was ${valid ? "invalid" : "valid"}`
      );
    };
  }));

  it("should get long month names in persian", () => {
    adapter.setLocale("fa");
    expect(adapter.getMonthNames("long")).toEqual([
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند"
    ]);
  });

  it("should get long month names in persian", () => {
    adapter.setLocale("fa");
    expect(adapter.getMonthNames("short")).toEqual([
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند"
    ]);
  });
  it("should get long day of week names", () => {
    expect(adapter.getDayOfWeekNames("long")).toEqual([
      "یک‌شنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه"
    ]);
  });

  it("should get short day of week names", () => {
    expect(adapter.getDayOfWeekNames("short")).toEqual([
      "یک‌شنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه"
    ]);
  });

  it("should get narrow day of week names", () => {
    expect(adapter.getDayOfWeekNames("narrow")).toEqual([
      "ی",
      "د",
      "س",
      "چ",
      "پ",
      "ج",
      "ش"
    ]);
  });
  it("should get year name", () => {
    expect(adapter.getYearName(moment([2017, First_Month, 1]))).toBe("1395");
  });
  it("should get first day of week", () => {
    expect(adapter.getFirstDayOfWeek()).toBe(6);
  });
  it("should create Moment date", () => {
    expect(adapter.createDate(1396, 0, 1).format()).toEqual(
      moment({ y: 2017, M: 2, d: 21 }).format()
    );
  });

  it("should not create Moment date with month over/under-flow", () => {
    expect(() => adapter.createDate(1396, 11 + 1, 1)).toThrow();
    expect(() => adapter.createDate(1396, 0 - 1, 1)).toThrow();
  });

  it("should not create Moment date with date over/under-flow jalali", () => {
    // expect(() => adapter.createDate(1396, 0, 32)).toThrow();
    expect(() => adapter.createDate(1396, 0, 0)).toThrow();
  });

  it("should create Moment date with low year number jalali", () => {
    expect(adapter.createDate(-1, 0, 1).year()).toBe(-1); // -1
    expect(adapter.createDate(0, 0, 1).year()).toBe(0); // 0
    expect(adapter.createDate(50, 0, 1).year()).toBe(50); // 50
    expect(adapter.createDate(99, 0, 1).year()).toBe(99); // 99
    expect(adapter.createDate(100, 0, 1).year()).toBe(100); // 100
  });

  it("should get today's date", () => {
    expect(adapter.sameDate(adapter.today(), moment())).toBe(
      true,
      "should be equal to today's date"
    );
  });

  it("should parse string according to given format", () => {
    // tslint:disable-next-line:no-non-null-assertion
    expect(adapter.parse("2/1/1396", "jMM/jDD/jYYYY")!.format()).toEqual(
      moment([2017, 3, 21]).format()
    );
    // tslint:disable-next-line:no-non-null-assertion
    expect(adapter.parse("1/2/1396", "jDD/jMM/jYYYY")!.format()).toEqual(
      moment([2017, 3, 21]).format()
    );
  });

  it("should parse number", () => {
    const timestamp = new Date().getTime();
    // tslint:disable-next-line:no-non-null-assertion
    expect(adapter.parse(timestamp, "jMM/jDD/jYYYY")!.format()).toEqual(
      moment(timestamp).format()
    );
  });

  it("should parse Date", () => {
    const date = new Date(2017, First_Month, 1);
    // tslint:disable-next-line:no-non-null-assertion
    expect(adapter.parse(date, "jMM/jDD/jYYYY")!.format()).toEqual(
      moment(date).format()
    );
  });

  //   it("should parse Moment date Gregorian", () => {
  //     adapter.setLocale("en");
  //     const date = moment({ y: 2017, m: JAN, d: 1 });
  //     const parsedDate = adapter.parse(date, "MM/DD/YYYY");
  //     // tslint:disable-next-line:no-non-null-assertion
  //     expect(parsedDate!.format()).toEqual(date.format());
  //     expect(parsedDate).not.toBe(date);
  //   });

  it("should parse empty string as null", () => {
    expect(adapter.parse("", "jMM/jDD/jYYYY")).toBeNull();
  });

  it("should parse invalid value as invalid", () => {
    const d = adapter.parse("hello", "jMM/jDD/jYYYY");
    // console.log('hello: ', d);
    expect(d).not.toBeNull();
    expect(adapter.isDateInstance(d)).toBe(
      true,
      "Expected string to have been fed through Date.parse"
    );
    // console.log('adapter.isValid(d) ', adapter.isValid(d ));
    expect(adapter.isValid(d)).toBe(
      false,
      'Expected to parse as "invalid date" object'
    );
  });

  it("should format date according to given format", () => {
    expect(adapter.format(moment([2017, First_Month, 2]), "jMM/jDD/jYYYY")).toEqual(
      "10/13/1395"
    );
    expect(adapter.format(moment([2017, First_Month, 2]), "jDD/jMM/jYYYY")).toEqual(
      "13/10/1395"
    );
  });
  it("should format with a different locale", () => {
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual("13 دی 1395");
    adapter.setLocale("ja-JP");
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual(
      "2017年1月2日"
    );
  });

  it("should throw when attempting to format invalid date", () => {
    expect(() => adapter.format(moment(NaN), "jMM/jDD/jYYYY")).toThrowError(
      /JalaliMomentDateAdapter: Cannot format invalid date\./
    );
  });

  it("should add years - second", () => {
    expect(
      adapter
        .addCalendarYears(moment("1396/01/01", "jYYYY/jMM/jDD"), 1)
        .format()
    ).toEqual(moment("1397/01/01", "jYYYY/jMM/jDD").format());
    expect(
      adapter
        .addCalendarYears(moment("1396/01/01", "jYYYY/jMM/jDD"), -1)
        .format()
    ).toEqual(moment("1395/01/01", "jYYYY/jMM/jDD").format());
  });

  it("should add months - second", () => {
    expect(
      adapter
        .addCalendarMonths(moment("1396/01/01", "jYYYY/jMM/jDD"), 1)
        .format()
    ).toEqual(moment("1396/02/01", "jYYYY/jMM/jDD").format());
    expect(
      adapter
        .addCalendarMonths(moment("1396/01/01", "jYYYY/jMM/jDD"), -1)
        .format()
    ).toEqual(moment("1395/12/01", "jYYYY/jMM/jDD").format());
  });

  it("should respect month length differences when adding months", () => {
    expect(
      adapter.addCalendarMonths(moment([2017, SEP, 22]), 1).format()
    ).toEqual(moment([2017, OCT, 22]).format());
    expect(
      adapter.addCalendarMonths(moment([2017, SEP, 22]), -1).format()
    ).toEqual(moment([2017, AUG, 22]).format());
  });


  it("should add days - second", () => {
    expect(
      adapter.addCalendarDays(moment("1396/01/01", "jYYYY/jMM/jDD"), 1).format()
    ).toEqual(moment("1396/01/02", "jYYYY/jMM/jDD").format());
    expect(
      adapter
        .addCalendarDays(moment("1396/01/01", "jYYYY/jMM/jDD"), -1)
        .format()
    ).toEqual(moment("1395/12/30", "jYYYY/jMM/jDD").format());
  });



  it("should get year name", () => {
    moment.locale('en');
    adapter.setLocale('en');
    expect(adapter.getYearName(moment([2017, First_Month, 1]))).toBe("2017");
  });

  it("should get year name in a different locale", () => {
    adapter.setLocale("ja-JP");
    expect(adapter.getYearName(moment([2017, First_Month, 1]))).toBe("2017");
  });

  // it("should get first day of week", () => {
  //   expect(adapter.getFirstDayOfWeek()).toBe(0);
  // });

  it("should get first day of week in a different locale", () => {
    adapter.setLocale("fr");
    expect(adapter.getFirstDayOfWeek()).toBe(1);
  });

  it("should create Moment date", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(adapter.createDate(2017, First_Month, 1).format()).toEqual(
      moment([2017, First_Month, 1]).format()
    );
  });

  it("should not create Moment date with month over/under-flow", () => {
    adapter.setLocale("en");
    expect(() => adapter.createDate(2017, DEC + 1, 1)).toThrow();
    expect(() => adapter.createDate(2017, First_Month - 1, 1)).toThrow();
  });

  it("should not create Moment date with date over/under-flow Gregorian", () => {
    adapter.setLocale("en");
    expect(() => adapter.createDate(2017, First_Month, 32)).toThrow();
    expect(() => adapter.createDate(2017, First_Month, 0)).toThrow();
  });

  it("should create Moment date with low year number Gregorian", () => {
    adapter.setLocale("en");
    expect(adapter.createDate(-1, First_Month, 1).year()).toBe(-1);
    expect(adapter.createDate(0, First_Month, 1).year()).toBe(0);
    expect(adapter.createDate(50, First_Month, 1).year()).toBe(50);
    expect(adapter.createDate(99, First_Month, 1).year()).toBe(99);
    expect(adapter.createDate(100, First_Month, 1).year()).toBe(100);
  });

  it("should not create Moment date in utc format", () => {
    expect(adapter.createDate(2017, First_Month, 5).isUTC()).toEqual(false);
  });

  it("should get today's date", () => {
    expect(adapter.sameDate(adapter.today(), moment())).toBe(
      true,
      "should be equal to today's date"
    );
  });

  it("should parse string according to given format", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(adapter.parse("1/2/2017", "MM/DD/YYYY")!.format()).toEqual(
      moment([2017, First_Month, 2]).format()
    );
    expect(adapter.parse("1/2/2017", "DD/MM/YYYY")!.format()).toEqual(
      moment([2017, FEB, 1]).format()
    );
  });

  it("should parse number", () => {
    let timestamp = new Date().getTime();
    expect(adapter.parse(timestamp, "MM/DD/YYYY")!.format()).toEqual(
      moment(timestamp).format()
    );
  });

  it("should parse Date", () => {
    let date = new Date(2017, First_Month, 1);
    expect(adapter.parse(date, "MM/DD/YYYY")!.format()).toEqual(
      moment(date).format()
    );
  });

  it("should parse empty string as null", () => {
    expect(adapter.parse("", "MM/DD/YYYY")).toBeNull();
  });

  it("should parse invalid value as invalid", () => {
    let d = adapter.parse("hello", "MM/DD/YYYY");
    expect(d).not.toBeNull();
    expect(adapter.isDateInstance(d)).toBe(
      true,
      "Expected string to have been fed through Date.parse"
    );
    expect(adapter.isValid(d as moment.Moment)).toBe(
      false,
      'Expected to parse as "invalid date" object'
    );
  });

  it("should format date according to given format", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(adapter.format(moment([2017, First_Month, 2]), "MM/DD/YYYY")).toEqual(
      "01/02/2017"
    );
    expect(adapter.format(moment([2017, First_Month, 2]), "DD/MM/YYYY")).toEqual(
      "02/01/2017"
    );
  });

  it("should format with a different locale", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual("Jan 2, 2017");
    adapter.setLocale("ja-JP");
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual(
      "2017年1月2日"
    );
  });

  it("should throw when attempting to format invalid date", () => {
    expect(() => adapter.format(moment(NaN), "MM/DD/YYYY")).toThrowError(
      /JalaliMomentDateAdapter: Cannot format invalid date\./
    );
  });

  it("should add years", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.addCalendarYears(moment([2017, First_Month, 1]), 1).format()
    ).toEqual(moment([2018, First_Month, 1]).format());
    expect(
      adapter.addCalendarYears(moment([2017, First_Month, 1]), -1).format()
    ).toEqual(moment([2016, First_Month, 1]).format());
  });

  it("should respect leap years when adding years", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.addCalendarYears(moment([2016, FEB, 29]), 1).format()
    ).toEqual(moment([2017, FEB, 28]).format());
    expect(
      adapter.addCalendarYears(moment([2016, FEB, 29]), -1).format()
    ).toEqual(moment([2015, FEB, 28]).format());
  });

  it("should add months", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.addCalendarMonths(moment([2017, First_Month, 1]), 1).format()
    ).toEqual(moment([2017, FEB, 1]).format());
    expect(
      adapter.addCalendarMonths(moment([2017, First_Month, 1]), -1).format()
    ).toEqual(moment([2016, DEC, 1]).format());
  });

  it("should respect month length differences when adding months", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.addCalendarMonths(moment([2017, First_Month, 31]), 1).format()
    ).toEqual(moment([2017, FEB, 28]).format());
    expect(
      adapter.addCalendarMonths(moment([2017, MAR, 31]), -1).format()
    ).toEqual(moment([2017, FEB, 28]).format());
  });

  it("should add days", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(adapter.addCalendarDays(moment([2017, First_Month, 1]), 1).format()).toEqual(
      moment([2017, First_Month, 2]).format()
    );
    expect(
      adapter.addCalendarDays(moment([2017, First_Month, 1]), -1).format()
    ).toEqual(moment([2016, DEC, 31]).format());
  });

  it("should clone", () => {
    let date = moment([2017, First_Month, 1]);
    expect(adapter.clone(date).format()).toEqual(date.format());
    expect(adapter.clone(date)).not.toBe(date);
  });

  it("should compare dates", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.compareDate(moment([2017, First_Month, 1]), moment([2017, First_Month, 2]))
    ).toBeLessThan(0);
    expect(
      adapter.compareDate(moment([2017, First_Month, 1]), moment([2017, FEB, 1]))
    ).toBeLessThan(0);
    expect(
      adapter.compareDate(moment([2017, First_Month, 1]), moment([2018, First_Month, 1]))
    ).toBeLessThan(0);
    expect(
      adapter.compareDate(moment([2017, First_Month, 1]), moment([2017, First_Month, 1]))
    ).toBe(0);
    expect(
      adapter.compareDate(moment([2018, First_Month, 1]), moment([2017, First_Month, 1]))
    ).toBeGreaterThan(0);
    expect(
      adapter.compareDate(moment([2017, FEB, 1]), moment([2017, First_Month, 1]))
    ).toBeGreaterThan(0);
    expect(
      adapter.compareDate(moment([2017, First_Month, 2]), moment([2017, First_Month, 1]))
    ).toBeGreaterThan(0);
  });

  it("should clamp date at lower bound", () => {
    moment.locale("en");
    adapter.setLocale("en");
    expect(
      adapter.clampDate(
        moment([2017, First_Month, 1]),
        moment([2018, First_Month, 1]),
        moment([2019, First_Month, 1])
      )
    ).toEqual(moment([2018, First_Month, 1]));
  });

  it("should clamp date at upper bound", () => {
    expect(
      adapter.clampDate(
        moment([2020, First_Month, 1]),
        moment([2018, First_Month, 1]),
        moment([2019, First_Month, 1])
      )
    ).toEqual(moment([2019, First_Month, 1]));
  });

  it("should clamp date already within bounds", () => {
    expect(
      adapter.clampDate(
        moment([2018, FEB, 1]),
        moment([2018, First_Month, 1]),
        moment([2019, First_Month, 1])
      )
    ).toEqual(moment([2018, FEB, 1]));
  });

  it("should count today as a valid date instance", () => {
    let d = moment();
    expect(adapter.isValid(d)).toBe(true);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it("should count an invalid date as an invalid date instance", () => {
    let d = moment(NaN);
    expect(adapter.isValid(d)).toBe(false);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it("should count a string as not a date instance", () => {
    let d = "1/1/2017";
    expect(adapter.isDateInstance(d)).toBe(false);
  });

  it("should count a Date as not a date instance", () => {
    let d = new Date();
    expect(adapter.isDateInstance(d)).toBe(false);
  });

  it("should create valid dates from valid ISO strings", () => {
    assertValidDate(adapter.deserialize("1985-04-12T23:20:50.52Z"), true);
    assertValidDate(adapter.deserialize("1996-12-19T16:39:57-08:00"), true);
    assertValidDate(adapter.deserialize("1937-01-01T12:00:27.87+00:20"), true);
    assertValidDate(adapter.deserialize("1990-13-31T23:59:00Z"), false);
    // assertValidDate(adapter.deserialize("1/1/2017"), false);
    expect(adapter.deserialize("")).toBeNull();
    expect(adapter.deserialize(null)).toBeNull();
    assertValidDate(adapter.deserialize(new Date()), true);
    assertValidDate(adapter.deserialize(new Date(NaN)), false);
    assertValidDate(adapter.deserialize(moment()), true);
    assertValidDate(adapter.deserialize(moment.invalid()), false);
  });

  it("setLocale should not modify global moment locale", () => {
    expect(moment.locale()).toBe("fa");
    adapter.setLocale("ja-JP");
    expect(moment.locale()).toBe("fa");
  });

  it("returned Moments should have correct locale", () => {
    adapter.setLocale("ja-JP");
    expect(adapter.createDate(2017, First_Month, 1).locale()).toBe("ja");
    expect(adapter.today().locale()).toBe("ja");
    expect(adapter.clone(moment()).locale()).toBe("ja");
    expect(adapter.parse("1/1/2017", "MM/DD/YYYY")!.locale()).toBe("ja");
    expect(adapter.addCalendarDays(moment(), 1).locale()).toBe("ja");
    expect(adapter.addCalendarMonths(moment(), 1).locale()).toBe("ja");
    expect(adapter.addCalendarYears(moment(), 1).locale()).toBe("ja");
  });

  it("should not change locale of Moments passed as params", () => {
    moment.locale("en");
    adapter.setLocale("en");
    let date = moment();
    expect(date.locale()).toBe("en");
    adapter.setLocale("ja-JP");
    adapter.getYear(date);
    adapter.getMonth(date);
    adapter.getDate(date);
    adapter.getDayOfWeek(date);
    adapter.getYearName(date);
    adapter.getNumDaysInMonth(date);
    adapter.clone(date);
    adapter.parse(date, "MM/DD/YYYY");
    adapter.format(date, "MM/DD/YYYY");
    adapter.addCalendarDays(date, 1);
    adapter.addCalendarMonths(date, 1);
    adapter.addCalendarYears(date, 1);
    adapter.toIso8601(date);
    adapter.isDateInstance(date);
    adapter.isValid(date);
    expect(date.locale()).toBe("en");
  });

  it("should create invalid date", () => {
    assertValidDate(adapter.invalid(), false);
  });
});

describe("JalaliMomentDateAdapter with MAT_DATE_LOCALE override", () => {
  let adapter: JalaliMomentDateAdapter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentDateModule],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: "ja-JP" }]
    }).compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: JalaliMomentDateAdapter) => {
    adapter = d;
  }));

  it("should take the default locale id from the MAT_DATE_LOCALE injection token", () => {
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual(
      "2017年1月2日"
    );
  });
});

describe("JalaliMomentDateAdapter with LOCALE_ID override", () => {
  let adapter: JalaliMomentDateAdapter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentDateModule],
      providers: [{ provide: LOCALE_ID, useValue: "fr" }]
    }).compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: JalaliMomentDateAdapter) => {
    adapter = d;
  }));

  it("should take the default locale id from the LOCALE_ID injection token", () => {
    expect(adapter.format(moment([2017, First_Month, 2]), "ll")).toEqual(
      "2 janv. 2017"
    );
  });
});

describe("JalaliMomentDateAdapter with MAT_MOMENT_DATE_ADAPTER_OPTIONS override", () => {
  let adapter: JalaliMomentDateAdapter;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentDateModule],
      providers: [
        {
          provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
          useValue: { useUtc: true }
        },
        { provide: MAT_DATE_LOCALE, useValue: "fa" }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([DateAdapter], (d: JalaliMomentDateAdapter) => {
    adapter = d;
  }));

  describe("use UTC", () => {
    it("should create Moment date in UTC", () => {
      expect(adapter.createDate(1399, First_Month, 20).isUtc()).toBe(true);
    });

    it("should create today in UTC", () => {
      expect(adapter.today().isUtc()).toBe(true);
    });

    it("should parse dates to UTC", () => {
      expect(adapter.parse("1/2/2017", "MM/DD/YYYY")!.isUtc()).toBe(true);
    });

    it("should return UTC date when deserializing", () => {
      expect(adapter.deserialize("1985-04-12T23:20:50.52Z")!.isUtc()).toBe(
        true
      );
    });
  });
});
