export function usdToBs(usdAmount: number, rate: number): number {
  const usd = Number(usdAmount);
  const fx = Number(rate);
  if (!Number.isFinite(usd) || !Number.isFinite(fx) || fx <= 0) return 0;
  return Math.round(usd * fx * 100) / 100;
}

export type FxCurrency = "usd" | "eur";

export function rateForSan(
  fx:
    | {
        usd: number;
        eur: number;
        currency: FxCurrency;
        rate: number;
      }
    | undefined,
  sanFx?: FxCurrency | null,
): number | null {
  if (!fx) return null;
  const currency = sanFx === "usd" || sanFx === "eur" ? sanFx : fx.currency;
  const rate = currency === "eur" ? Number(fx.eur) : Number(fx.usd);
  if (Number.isFinite(rate) && rate > 0) return rate;
  const fallback = Number(fx.rate);
  return Number.isFinite(fallback) && fallback > 0 ? fallback : null;
}

export function formatUsd(amount: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "$0.00";
  return `$${value.toFixed(2)}`;
}

export function formatBs(amount: number): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "Bs 0,00";
  const [int, dec] = value.toFixed(2).split(".");
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Bs ${withDots},${dec}`;
}
