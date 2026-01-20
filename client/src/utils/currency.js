export const formatCurrency = (amountInCents, currency = 'LKR') => {
  if (amountInCents == null || isNaN(amountInCents)) {
    return `0.00 ${currency}`;
  }

  const amount = amountInCents / 100;
  return `${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};
