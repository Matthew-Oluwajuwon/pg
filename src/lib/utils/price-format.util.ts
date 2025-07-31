export const formatPrice = (
  amount: number | string,
  currency: string = "₦",
): string => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) return `${currency}0`;

  return `${currency}${value.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};
