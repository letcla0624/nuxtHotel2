export function useThousands(num: number | undefined): string {
  if (num == null || isNaN(num)) return "0";
  const comma = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(comma, ",");
}
