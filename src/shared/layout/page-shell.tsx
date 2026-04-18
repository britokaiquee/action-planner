import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";

type Tone = "gestor" | "tecnico";

interface PageShellProps {
  title: string;
  subtitle?: string;
  tone?: Tone;
  dateLabel?: string;
  metaLabel?: string;
  statusLabel?: string;
  backHref?: string;
  showEditAction?: boolean;
  headerAction?: ReactNode;
  headerClassName?: string;
  children: ReactNode;
}

export function PageShell({
  title,
  subtitle,
  tone = "gestor",
  dateLabel,
  metaLabel,
  statusLabel,
  backHref,
  showEditAction = false,
  headerAction,
  headerClassName,
  children,
}: PageShellProps) {
  const isGestor = tone === "gestor";
  const hasHeaderControl = Boolean(headerAction || showEditAction);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={cn(
          "px-4 pb-4 pt-7 text-white shadow-hero sm:px-6 sm:pb-8 sm:pt-10",
          isGestor ? "bg-gestor" : "bg-tecnico",
          headerClassName,
        )}
      >
        <div className="mx-auto flex max-w-5xl items-start gap-3 sm:gap-4">
          {backHref ? (
            <Link
              aria-label="Voltar"
              className="mt-1 inline-flex h-11 w-11 items-center justify-center text-white transition hover:text-white/90"
              href={backHref}
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
          ) : null}

          <div className="flex-1">
            <h1 className="text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-screen-title">{title}</h1>
            {subtitle ? <p className="mt-1 max-w-3xl text-[0.95rem] leading-snug text-white/82 sm:mt-2 sm:text-[2rem]">{subtitle}</p> : null}

            {statusLabel || dateLabel || metaLabel ? (
              <div
                className={cn(
                  "mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-1.5 sm:mt-5 sm:gap-3",
                  hasHeaderControl ? "mr-[-3.25rem] w-[calc(100%+3.25rem)] sm:mr-[-4.5rem] sm:w-[calc(100%+4.5rem)]" : undefined,
                )}
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                  {statusLabel ? <Badge variant="info">{statusLabel}</Badge> : null}
                  {dateLabel ? <span className="text-[0.9rem] leading-tight text-white/88 sm:text-[1.9rem]">{dateLabel}</span> : null}
                </div>

                {metaLabel ? <span className="row-start-1 self-end whitespace-nowrap text-[1rem] font-semibold leading-none text-white sm:text-[1.9rem]">{metaLabel}</span> : null}
              </div>
            ) : null}
          </div>

          {headerAction ? (
            headerAction
          ) : showEditAction ? (
            <button
              aria-label="Editar"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/15 transition hover:bg-black/20"
              type="button"
            >
              <PencilLine className="h-7 w-7" />
            </button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6">{children}</main>
    </div>
  );
}