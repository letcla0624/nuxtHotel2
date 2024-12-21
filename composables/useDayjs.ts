export default function useDayjs() {
  const { $dayjs } = useNuxtApp();

  const formatter = (date: string | Date) =>
    $dayjs(date).format("MM 月 DD 日 dddd");

  const formatterYearToDate = (date: string | Date) =>
    $dayjs(date).format("YYYY 年 MM 月 DD 日");

  const formatterDate = (date: string | Date) =>
    $dayjs(date).format("YYYY-MM-DD");

  return { formatter, formatterYearToDate, formatterDate };
}
