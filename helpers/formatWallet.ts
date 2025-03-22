export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 12) return address;
  const first = address.slice(0, 6);
  const last = address.slice(-6);
  return `${first}...${last}`;
};
