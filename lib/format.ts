export const fmtInt = (n: number) => Math.round(n).toLocaleString("tr-TR");

export const fmtTl = (n: number, digits = 0) =>
  `${n.toLocaleString("tr-TR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} TL`;

export const fmtPct = (rate: number) => `%${Math.round(rate * 100)}`;
