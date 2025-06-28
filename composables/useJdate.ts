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