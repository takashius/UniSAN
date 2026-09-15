export function usdToBs(usdAmount: number, rate: number): number {
  const usd = Number(usdAmount);
  const fx = Number(rate);
  if (!Number.isFinite(usd) || !Number.isFinite(fx) || fx <= 0) return 0;
  return Math.round(usd * fx * 100) / 100;
}

export function formatUsd(amount: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

export function formatBs(amount: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 'Bs 0,00';
  const [int, dec] = value.toFixed(2).split('.');
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Bs ${withDots},${dec}`;
}
