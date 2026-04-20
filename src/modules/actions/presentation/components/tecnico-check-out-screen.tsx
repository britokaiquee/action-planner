"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, ChevronDown, LogOut, MapPin } from "lucide-react";

import { getTecnicoCheckOut, type TecnicoCheckOutViewModel } from "@/modules/actions/application/get-tecnico-check-out";
import { clearPendingDemoCheckout, getPendingDemoCheckout } from "@/modules/actions/infrastructure/demo-checkout-session";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { authDemoCredentials } from "@/modules/auth/infrastructure/auth.seed";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

import { ExecutionConfirmDialog } from "./execution-confirm-dialog";
import { TecnicoExecutionActionInfoCard, TecnicoExecutionResourcesList } from "./tecnico-execution-sections";

interface TecnicoCheckOutScreenProps {
  actionId: string;
  actionDate?: string;
  transientCheckInTimestamp?: string;
}

function TecnicoCheckOutLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8.75rem-2.25rem)] w-full max-w-[32rem] flex-col gap-4 sm:min-h-[calc(100vh-9.5rem-2.75rem)] lg:max-w-[39.5rem]">
      <div className="min-h-[12rem] animate-pulse rounded-[1.25rem] border border-border bg-card shadow-card" />
      <div className="h-[5rem] animate-pulse rounded-[1.25rem] border border-border bg-card shadow-card" />
      <div className="h-[5rem] animate-pulse rounded-[1.25rem] border border-border bg-card shadow-card" />
      <div className="h-[3.4rem] animate-pulse rounded-[2rem] border border-border bg-card shadow-card" />
      <div className="h-[7.5rem] animate-pulse rounded-[1.1rem] border border-[#b5d4ff] bg-[#edf5ff]" />
      <div className="h-[3.9rem] animate-pulse rounded-[1.2rem] bg-[#ffd9d9]" />
    </div>
  );
}

function ExpandableSectionCard({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full rounded-[1.15rem] border-[#d9dfe8] shadow-[0_2px_8px_rgba(16,24,40,0.06),0_3px_8px_rgba(16,24,40,0.04)]">
      <button
        aria-expanded={isOpen}
        className="flex min-h-[4.9rem] w-full items-center justify-between gap-4 px-[1.1rem] py-[1.1rem] text-left sm:min-h-[5.15rem] sm:px-5 sm:py-5 lg:px-[1.35rem] lg:py-[1.35rem]"
        onClick={onToggle}
        type="button"
      >
        <span className="text-[1.28rem] font-semibold leading-[1.02] tracking-[-0.04em] text-text-strong sm:text-[1.42rem] lg:text-[1.24rem]">
          {title}
        </span>
        <ChevronDown className={cn("h-6 w-6 shrink-0 text-[#556176] transition-transform duration-200", isOpen ? "rotate-180" : undefined)} />
      </button>

      {isOpen ? <CardContent className="px-[1.1rem] pb-[1.1rem] pt-0 sm:px-5 sm:pb-5 lg:px-[1.35rem] lg:pb-[1.35rem]">{children}</CardContent> : null}
    </Card>
  );
}

export function TecnicoCheckOutScreen({ actionId, actionDate, transientCheckInTimestamp }: TecnicoCheckOutScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [checkOut, setCheckOut] = useState<TecnicoCheckOutViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const isDemoTecnico = user?.email?.toLowerCase() === authDemoCredentials.tecnico.email.toLowerCase();

  useEffect(() => {
    let isActive = true;

    async function loadCheckOut() {
      if (!actionId || !user?.name) {
        if (isActive) {
          setCheckOut(null);
          setIsLoading(false);
        }

        return;
      }

      setIsLoading(true);

      const resolvedTransientCheckInTimestamp =
        transientCheckInTimestamp ??
        (user.email
          ? getPendingDemoCheckout({
              actionDate,
              actionId,
              userEmail: user.email,
            })?.checkInAt
          : undefined);

      const nextCheckOut = await getTecnicoCheckOut(actionRepository, {
        actionId,
        actionDate,
        technicianName: user.name,
        transientCheckInTimestamp: resolvedTransientCheckInTimestamp,
      });

      if (!isActive) {
        return;
      }

      setCheckOut(nextCheckOut);
      setIsLoading(false);
    }

    void loadCheckOut();

    return () => {
      isActive = false;
    };
  }, [actionDate, actionId, transientCheckInTimestamp, user?.email, user?.name]);

  const resolvedActionDate = checkOut?.actionDate ?? actionDate;
  const resolvedTransientCheckInTimestamp =
    transientCheckInTimestamp ??
    (user?.email
      ? getPendingDemoCheckout({
          actionDate: resolvedActionDate,
          actionId,
          userEmail: user.email,
        })?.checkInAt
      : undefined);
  const backHref = "/tecnico";
  const participantsHref = checkOut
    ? checkOut.actionDate
      ? `/tecnico/check-in/${checkOut.actionId}/participantes?date=${checkOut.actionDate}&origin=checkout${resolvedTransientCheckInTimestamp ? `&checkInAt=${encodeURIComponent(resolvedTransientCheckInTimestamp)}` : ""}`
      : `/tecnico/check-in/${checkOut.actionId}/participantes?origin=checkout${resolvedTransientCheckInTimestamp ? `&checkInAt=${encodeURIComponent(resolvedTransientCheckInTimestamp)}` : ""}`
    : "#";

  async function waitForNextFrame() {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  }

  function handleOpenConfirmDialog() {
    if (isSubmitting) {
      return;
    }

    setIsConfirmDialogOpen(true);
  }

  async function handleCloseAction() {
    if (isSubmitting) {
      return;
    }

    setIsConfirmDialogOpen(false);
    setIsSubmitting(true);
    await waitForNextFrame();

    if (isDemoTecnico && user?.email) {
      clearPendingDemoCheckout({
        actionDate: resolvedActionDate,
        actionId,
        userEmail: user.email,
      });
    }

    router.replace("/tecnico");
  }

  return (
    <ProtectedRoleRoute role="tecnico">
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-tecnico text-white shadow-hero">
          <div className="mx-auto flex min-h-[8.75rem] w-full max-w-[56.25rem] items-center gap-3 px-4 pb-[18px] pt-10 sm:min-h-[9.5rem] sm:px-6 sm:pb-[18px] sm:pt-11">
            <Link
              aria-label="Voltar para o dashboard técnico"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-white transition hover:text-white/90 sm:h-9 sm:w-9"
              href={backHref}
            >
              <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.55rem]">{checkOut?.headerTitle ?? "Ação"}</h1>
              <p className="mt-1 text-[0.98rem] leading-snug text-white/90 sm:text-[1.12rem]">{checkOut?.headerSubtitle ?? "Carregando ação"}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[56.25rem] px-4 pb-8 pt-4 sm:px-6 sm:pb-10">
          {isLoading ? (
            <TecnicoCheckOutLoading />
          ) : !checkOut ? (
            <Card className="mx-auto w-full max-w-[32rem] rounded-[1.25rem] lg:max-w-[39.5rem]">
              <CardContent className="space-y-3 p-6 sm:p-8">
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-text-strong">Ação indisponível</h2>
                <p className="text-[0.98rem] leading-relaxed text-text-muted">
                  Não encontramos uma escala válida para este check-out com o técnico autenticado.
                </p>
                <Button className="mt-2" onClick={() => router.push("/tecnico")} variant="secondary">
                  Voltar ao dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mx-auto flex min-h-[calc(100vh-8.75rem-2.25rem)] w-full max-w-[32rem] flex-col gap-3.5 sm:min-h-[calc(100vh-9.5rem-2.75rem)] lg:max-w-[39.5rem]">
              <TecnicoExecutionActionInfoCard
                contentClassName="min-h-[11.75rem] sm:min-h-[12.2rem] lg:min-h-[11.8rem]"
                dateLabel={checkOut.dateLabel}
                locationLabel={checkOut.locationLabel}
                participantsHref={participantsHref}
                timeLabel={checkOut.timeLabel}
              />

              <ExpandableSectionCard isOpen={isResourcesOpen} onToggle={() => setIsResourcesOpen((current) => !current)} title="Recursos">
                <TecnicoExecutionResourcesList resources={checkOut.resources} />
              </ExpandableSectionCard>

              <ExpandableSectionCard isOpen={isAttachmentsOpen} onToggle={() => setIsAttachmentsOpen((current) => !current)} title="Anexos">
                <div className="rounded-[0.95rem] bg-[#f8f9fc] px-4 py-4 text-[0.96rem] leading-relaxed text-text-muted">
                  Ainda não há anexos para esta ação.
                </div>
              </ExpandableSectionCard>

              <button
                className="inline-flex h-[3.35rem] min-h-[3.35rem] w-full items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-[#d9dfe8] bg-card px-5 text-[1.02rem] font-semibold text-text-strong shadow-[0_2px_8px_rgba(16,24,40,0.04)] transition hover:bg-[#fbfcfe] sm:h-[3.45rem] sm:min-h-[3.45rem] sm:text-[1.08rem]"
                type="button"
              >
                <Camera className="h-6 w-6 text-tecnico" strokeWidth={2.1} />
                Anexar fotos ou vídeos
              </button>

              <Card className="w-full rounded-[1rem] border-[#b5d4ff] bg-[#edf5ff] shadow-none">
                <CardContent className="flex min-h-[7.25rem] items-center justify-between gap-4 p-[1.1rem] sm:min-h-[7.55rem] sm:p-5 lg:min-h-[7.3rem] lg:p-[1.35rem]">
                  <div className="min-w-0">
                    <p className="text-[0.96rem] font-medium text-[#556176] sm:text-[1.02rem]">{checkOut.checkInCardTitle}</p>
                    <p className="mt-2 text-[3rem] font-semibold leading-none tracking-[-0.08em] text-tecnico sm:text-[3.3rem] lg:text-[3.15rem]">
                      {checkOut.checkInTimeLabel}
                    </p>
                  </div>

                  <button
                    className="inline-flex h-[4.05rem] w-[4.05rem] shrink-0 items-center justify-center rounded-[1rem] bg-tecnico text-white shadow-[0_12px_22px_rgba(37,99,235,0.2)] transition hover:bg-tecnico-dark"
                    type="button"
                  >
                    <MapPin className="h-8 w-8" strokeWidth={2.2} />
                  </button>
                </CardContent>
              </Card>

              <Button
                className="mt-1 h-[3.9rem] min-h-[3.9rem] rounded-[1.2rem] text-[1.1rem] font-semibold shadow-[0_14px_24px_rgba(203,27,27,0.22)] sm:text-[1.16rem]"
                disabled={isSubmitting}
                onClick={handleOpenConfirmDialog}
                variant="danger"
              >
                <LogOut className="mr-2.5 h-6 w-6 shrink-0" strokeWidth={2.1} />
                {isSubmitting ? "Realizando o check-out..." : "Encerrar"}
              </Button>
            </div>
          )}
        </main>

        <ExecutionConfirmDialog
          confirmLabel="Confirmar"
          description="Tem certeza que deseja realizar o check-out e encerrar esta ação?"
          icon={<LogOut className="h-6 w-6" strokeWidth={2.1} />}
          isSubmitting={isSubmitting}
          onCancel={() => setIsConfirmDialogOpen(false)}
          onConfirm={() => void handleCloseAction()}
          open={isConfirmDialogOpen}
          title="Confirmar check-out"
          variant="danger"
        />
      </div>
    </ProtectedRoleRoute>
  );
}