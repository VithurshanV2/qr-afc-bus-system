export const formatIssuedDate = (isDate) => {
  return new Date(isDate).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
