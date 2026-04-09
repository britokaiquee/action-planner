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
  statusLabel?: string;
  backHref?: string;
  showEditAction?: boolean;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function PageShell({
  title,
  subtitle,
  tone = "gestor",
  dateLabel,
  statusLabel,
  backHref,
  showEditAction = false,
  headerAction,
  children,
}: PageShellProps) {
  const isGestor = tone === "gestor";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={cn(
          "px-6 pb-8 pt-10 text-white shadow-hero",
          isGestor ? "bg-gestor" : "bg-tecnico",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-start gap-4">
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
            <h1 className="text-[1.5rem] font-semibold leading-tight text-white sm:text-screen-title">{title}</h1>
            {subtitle ? <p className="mt-1 max-w-3xl text-sm text-white/88 sm:mt-2 sm:text-[2rem]">{subtitle}</p> : null}

            {statusLabel || dateLabel ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
                {statusLabel ? <Badge variant="info">{statusLabel}</Badge> : null}
                {dateLabel ? <span className="text-[0.8rem] text-white/95 sm:text-[1.9rem]">{dateLabel}</span> : null}
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