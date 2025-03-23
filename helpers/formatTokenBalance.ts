export const formatTokenBalance = (balance: string) => {
  const parsedBalance = parseFloat(balance);
  return parsedBalance.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};
