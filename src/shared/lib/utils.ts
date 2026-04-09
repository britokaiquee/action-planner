import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLongDate(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

export function formatShortDateTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${formatShortDate(startDate)} ate ${formatShortDate(endDate)}`;
}

export function formatStatusLabel(status: string) {
  const labels: Record<string, string> = {
    planejamento: "Em Planejamento",
    andamento: "Em Andamento",
    concluida: "Concluida",
    atrasada: "Atrasada",
    confirmado: "Confirmado",
    pendente: "Pendente",
    conflito: "Conflito",
  };

  return labels[status] ?? status;
}