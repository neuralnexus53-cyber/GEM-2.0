import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amountCr: number): string {
  if (amountCr >= 1) {
    return `₹ ${amountCr.toFixed(2)} Cr`;
  }
  const inLakhs = amountCr * 100;
  return `₹ ${inLakhs.toFixed(2)} Lakhs`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}