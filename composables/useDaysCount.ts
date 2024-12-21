// 計算幾晚
export default function useDaysCount(startDate: string, endDate: string) {
  if (startDate === null || endDate === null) return 0;

  const differenceTime =
    new Date(endDate).getTime() - new Date(startDate).getTime();

  const differenceDay = Math.round(differenceTime / (1000 * 60 * 60 * 24));

  return differenceDay;
}
