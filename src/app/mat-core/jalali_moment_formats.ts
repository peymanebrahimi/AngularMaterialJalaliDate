import { MatDateFormats } from '@angular/material/core';

export const JALALI_MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "jYYYY-jMM-jDD"
  },
  display: {
    dateInput: "jYYYY-jMM-jDD",
    monthYearLabel: "jYYYY jMMMM",
    dateA11yLabel: "jYYYY-jMM-jDD",
    monthYearA11yLabel: "jYYYY jMMMM"
  }
};

export const MOMENT_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "l"
  },
  display: {
    dateInput: "l",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
