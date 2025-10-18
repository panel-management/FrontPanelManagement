import jalaali from "jalaali-js";

export const useDateConverter = () => {
  const jalaliToGregorian = (jalaliDate: string): string | null => {
    if (!jalaliDate) return null;

    try {
      const [year, month, day] = jalaliDate.split("/").map(Number);
      const gregorian = jalaali.toGregorian(year, month, day);
      return `${gregorian.gy}-${String(gregorian.gm).padStart(2, "0")}-${String(
        gregorian.gd
      ).padStart(2, "0")}`;
    } catch (error) {
      console.error("خطا در تبدیل تاریخ:", error);
      return null;
    }
  };

  const gregorianToJalali = (gregorianDate: string): string => {
    try {
      const [year, month, day] = gregorianDate.split("-").map(Number);
      const jalali = jalaali.toJalaali(year, month, day);

      return `${jalali.jy}/${String(jalali.jm).padStart(2, "0")}/${String(
        jalali.jd
      ).padStart(2, "0")}`;
    } catch (error) {
      console.error("خطا در تبدیل تاریخ:", error);
      return "";
    }
  };

  const jalaliToDate = (jalaliDate: string): Date | null => {
    try {
      const [year, month, day] = jalaliDate.split("/").map(Number);
      const gregorian = jalaali.toGregorian(year, month, day);
      return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
    } catch (error) {
      console.error("خطا در تبدیل تاریخ:", error);
      return null;
    }
  };

  return {
    jalaliToGregorian,
    gregorianToJalali,
    jalaliToDate,
  };
};
