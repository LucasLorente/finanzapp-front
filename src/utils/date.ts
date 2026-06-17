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

export function getDateRangeForMonth(yearMonth: string): DateRange {
  const date = dayjs(yearMonth + "-01");
  return {
    startDate: date.startOf("month").format("YYYY-MM-DD"),
    endDate: date.endOf("month").format("YYYY-MM-DD"),
  };
}
