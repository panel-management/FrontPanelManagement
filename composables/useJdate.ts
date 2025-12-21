import dayjs from "dayjs";
import "dayjs/locale/fa";

dayjs.locale("fa");

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
