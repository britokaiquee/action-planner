import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function parseDateValue(value: string | Date) {
  if (value instanceof Date) {
    return value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
  }).format(parseDateValue(date));
}

export function formatLongDateTitleCase(date: string | Date) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatter
    .formatToParts(parseDateValue(date))
    .map((part) => {
      if (part.type === "weekday" || part.type === "month") {
        return capitalize(part.value);
      }

      return part.value;
    })
    .join("");
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(parseDateValue(date));
}

export function formatShortDateTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseDateValue(date));
}

export function formatDateKey(date: string | Date) {
  const value = parseDateValue(date);
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${value.getFullYear()}-${month}-${day}`;
}

export function formatDateRange(startDate: string, endDate: string) {
  return `${formatShortDate(startDate)} até ${formatShortDate(endDate)}`;
}

export function formatStatusLabel(status: string) {
  const labels: Record<string, string> = {
    planejamento: "Em Planejamento",
    andamento: "Em Andamento",
    concluida: "Concluída",
    atrasada: "Atrasada",
    confirmado: "Confirmado",
    pendente: "Pendente",
    conflito: "Conflito",
  };

  return labels[status] ?? status;
}