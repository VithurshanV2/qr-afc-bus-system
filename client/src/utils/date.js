export const formatIssuedDate = (isDate) => {
  if (!isDate) return '-';
  return new Date(isDate).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatIssuedDateNoTime = (isDate) => {
  if (!isDate) return '-';
  return new Date(isDate).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (isDate) => {
  if (!isDate) return '-';
  return new Date(isDate).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
