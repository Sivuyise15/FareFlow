/** 4250.8 -> "R 4,250.80"; with { decimals: 0 } -> "R 4,251". */
export function formatRand(amount: number, { decimals = 2 }: { decimals?: number } = {}) {
  const fixed = Math.abs(amount).toFixed(decimals);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${amount < 0 ? '-' : ''}R ${grouped}${fraction ? `.${fraction}` : ''}`;
}
