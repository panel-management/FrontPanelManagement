import dayjs from "dayjs";
import "dayjs/locale/fa";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("fa");
dayjs.extend(relativeTime);

export const useJDate = (
  date: any,
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions
) => {
  if (date instanceof Date) {
    return date.toLocaleDateString("fa-IR", options);
  }
  return new Date(date).toLocaleDateString("fa-IR", options);
};

export const useJDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const datePart = date.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timePart = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} - ${timePart}`;
};

export const useFormatPeriod = (dateString: string) => {
  const d = dayjs(dateString);
  const now = dayjs();

  if (d.isSame(now, "day")) {
    return "امروز";
  } else if (d.isSame(now, "week")) {
    return "این هفته";
  } else if (d.isSame(now, "month")) {
    return "این ماه";
  }

  return d.format("YYYY/MM/DD");
};

export const useTimeAgoFarsi = (dateString: string) => {
  const then = dayjs(dateString);
  const now = dayjs();

  const diffDays = now.diff(then, "day");
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = now.diff(then, "month");
  const diffYears = now.diff(then, "year");

  if (diffYears >= 1) {
    return `${diffYears} سال پیش`;
  }

  if (diffMonths >= 1) {
    return `${diffMonths} ماه پیش`;
  }

  if (diffWeeks >= 1) {
    return `${diffWeeks} هفته پیش`;
  }

  return then.fromNow();
};
