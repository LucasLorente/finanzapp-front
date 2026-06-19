const arsToUsd = (amountARS: number, ventaRate: number): number => {
  if (!ventaRate || ventaRate === 0) return 0;
  return amountARS / ventaRate;
};

export { arsToUsd };
