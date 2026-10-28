import dayjs from "dayjs";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function getDefaultDateRange(): DateRange {
  return {
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  };
}

// Date a monthly recurrence falls on in the month of `monthDate`, clamped to the month's last day (e.g. day 31 → Feb 28)
export function getRecurringDate(dayOfMonth: number, monthDate: string): string {
  const month = dayjs(monthDate).startOf("month");
  return month.date(Math.min(dayOfMonth, month.daysInMonth())).format("YYYY-MM-DD");
}

export function getDateRangeForMonth(yearMonth: string): DateRange {
  const date = dayjs(yearMonth + "-01");
  return {
    startDate: date.startOf("month").format("YYYY-MM-DD"),
    endDate: date.endOf("month").format("YYYY-MM-DD"),
  };
}
