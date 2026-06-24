export function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(value, decimals = 2) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatChartTime(timestamp, range) {
  const date = new Date(timestamp);
  if (range === '1D' || range === '1W') {
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: range === '1Y' ? '2-digit' : undefined,
  });
}

export function formatStatus(status) {
  if (!status) return '—';
  return status.replace(/_/g, ' ');
}
