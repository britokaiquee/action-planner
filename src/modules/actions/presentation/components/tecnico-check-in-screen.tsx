"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleCheckBig } from "lucide-react";

import { getTecnicoCheckIn, type TecnicoCheckInViewModel } from "@/modules/actions/application/get-tecnico-check-in";
import { registerActionExecution } from "@/modules/actions/application/register-action-execution";
import { savePendingDemoCheckout } from "@/modules/actions/infrastructure/demo-checkout-session";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { authDemoCredentials } from "@/modules/auth/infrastructure/auth.seed";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

import { ExecutionConfirmDialog } from "./execution-confirm-dialog";
import { TecnicoExecutionActionInfoCard, TecnicoExecutionResourcesList } from "./tecnico-execution-sections";

interface TecnicoCheckInScreenProps {
  actionId: string;
  actionDate?: string;
}

function TecnicoCheckInLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8.75rem-2.25rem)] w-full max-w-[32rem] flex-col gap-4 sm:min-h-[calc(100vh-9.5rem-2.75rem)] lg:max-w-[39.5rem]">
      <div className="min-h-[15.5rem] animate-pulse rounded-[1.25rem] border border-border bg-card shadow-card" />
      <div className="min-h-[16.75rem] animate-pulse rounded-[1.25rem] border border-border bg-card shadow-card" />
      <div className="mt-auto h-[3.75rem] animate-pulse rounded-[2rem] bg-tecnico/15" />
    </div>
  );
}

export function TecnicoCheckInScreen({ actionId, actionDate }: TecnicoCheckInScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<TecnicoCheckInViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const isDemoTecnico = user?.email?.toLowerCase() === authDemoCredentials.tecnico.email.toLowerCase();

  useEffect(() => {
    let isActive = true;

    async function loadCheckIn() {
      if (!actionId || !user?.name) {
        if (isActive) {
          setCheckIn(null);
          setIsLoading(false);
        }

        return;
      }

      setIsLoading(true);

      const nextCheckIn = await getTecnicoCheckIn(actionRepository, {
        actionId,
        actionDate,
        technicianName: user.name,
      });

      if (!isActive) {
        return;
      }

      setCheckIn(nextCheckIn);
      setIsLoading(false);
    }

    void loadCheckIn();

    return () => {
      isActive = false;
    };
  }, [actionDate, actionId, user?.name]);

  async function waitForNextFrame() {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  }

  function createDemoCheckInTimestamp(date?: string) {
    const resolvedDate = date ?? new Date().toISOString().slice(0, 10);

    return `${resolvedDate}T08:05:00`;
  }

  function handleOpenConfirmDialog() {
    if (!user?.name || !checkIn || checkIn.isLocationConfirmed || isSubmitting) {
      return;
    }

    setIsConfirmDialogOpen(true);
  }

  async function handleConfirmLocation() {
    if (!user?.name || !checkIn || checkIn.isLocationConfirmed || isSubmitting) {
      return;
    }

    setIsConfirmDialogOpen(false);
    setIsSubmitting(true);
    await waitForNextFrame();

    if (isDemoTecnico) {
      const transientCheckInTimestamp = createDemoCheckInTimestamp(checkIn.actionDate);
      const searchParams = new URLSearchParams();

      savePendingDemoCheckout({
        actionDate: checkIn.actionDate,
        actionId: checkIn.actionId,
        checkInAt: transientCheckInTimestamp,
        userEmail: user.email,
      });

      if (checkIn.actionDate) {
        searchParams.set("date", checkIn.actionDate);
      }

      searchParams.set("checkInAt", transientCheckInTimestamp);
      router.replace(`/tecnico/check-out/${checkIn.actionId}?${searchParams.toString()}`);
      return;
    }

    const executionRecord = await registerActionExecution(actionRepository, {
      actionId: checkIn.actionId,
      actionDate: checkIn.actionDate,
      technicianName: user.name,
      type: "check-in",
    });

    if (!executionRecord) {
      setIsSubmitting(false);
      return;
    }

    router.replace(checkIn.actionDate ? `/tecnico/check-out/${checkIn.actionId}?date=${checkIn.actionDate}` : `/tecnico/check-out/${checkIn.actionId}`);
  }

  return (
    <ProtectedRoleRoute role="tecnico">
      <div className="min-h-screen bg-background text-foreground">
        <header className="bg-tecnico text-white shadow-hero">
          <div className="mx-auto flex min-h-[8.75rem] w-full max-w-[56.25rem] items-center gap-3 px-4 pb-[18px] pt-10 sm:min-h-[9.5rem] sm:px-6 sm:pb-[18px] sm:pt-11">
            <Link
              aria-label="Voltar para o dashboard técnico"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center text-white transition hover:text-white/90 sm:h-9 sm:w-9"
              href="/tecnico"
            >
              <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-medium leading-tight tracking-[-0.03em] sm:text-[1.55rem]">{checkIn?.headerTitle ?? "Ação"}</h1>
              <p className="mt-1 text-[0.98rem] leading-snug text-white/90 sm:text-[1.12rem]">{checkIn?.headerSubtitle ?? "Carregando ação"}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[56.25rem] px-4 pb-8 pt-4 sm:px-6 sm:pb-10">
          {isLoading ? (
            <TecnicoCheckInLoading />
          ) : !checkIn ? (
            <Card className="mx-auto w-full max-w-[32rem] rounded-[1.25rem] lg:max-w-[39.5rem]">
              <CardContent className="space-y-3 p-6 sm:p-8">
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-text-strong">Ação indisponível</h2>
                <p className="text-[0.98rem] leading-relaxed text-text-muted">
                  Não encontramos uma escala válida para este check-in com o técnico autenticado.
                </p>
                <Button className="mt-2" onClick={() => router.push("/tecnico")} variant="secondary">
                  Voltar ao dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mx-auto flex min-h-[calc(100vh-8.75rem-2.25rem)] w-full max-w-[32rem] flex-col gap-4 sm:min-h-[calc(100vh-9.5rem-2.75rem)] lg:max-w-[39.5rem]">
              <TecnicoExecutionActionInfoCard
                contentClassName="min-h-[15.4rem] sm:min-h-[16rem] lg:min-h-[15rem]"
                dateLabel={checkIn.dateLabel}
                locationLabel={checkIn.locationLabel}
                participantsHref={checkIn.actionDate ? `/tecnico/check-in/${checkIn.actionId}/participantes?date=${checkIn.actionDate}` : `/tecnico/check-in/${checkIn.actionId}/participantes`}
                timeLabel={checkIn.timeLabel}
              />

              <Card className="w-full rounded-[1.15rem] border-[#d9dfe8] shadow-[0_2px_8px_rgba(16,24,40,0.06),0_3px_8px_rgba(16,24,40,0.04)]">
                <CardContent className="flex min-h-[17.1rem] flex-col gap-3 p-[1.1rem] sm:min-h-[17.8rem] sm:p-5 lg:min-h-[16.7rem] lg:p-[1.35rem]">
                  <div>
                    <h2 className="text-[1.28rem] font-semibold leading-[1.02] tracking-[-0.04em] text-text-strong sm:text-[1.42rem] lg:text-[1.24rem]">Recursos</h2>
                  </div>

                  <TecnicoExecutionResourcesList resources={checkIn.resources} />
                </CardContent>
              </Card>

              <Button
                className={cn(
                  "mx-auto h-[3.8rem] min-h-[3.8rem] w-fit rounded-[2rem] px-5 text-[1.05rem] font-semibold shadow-[0_12px_24px_rgba(37,99,235,0.22)] sm:h-[3.9rem] sm:min-h-[3.9rem] sm:text-[1.12rem] lg:h-[3.95rem] lg:min-h-[3.95rem]",
                  checkIn.isLocationConfirmed ? "bg-tecnico-dark" : undefined,
                )}
                disabled={checkIn.isLocationConfirmed || isSubmitting}
                onClick={handleOpenConfirmDialog}
                variant="secondary"
              >
                <CircleCheckBig className="mr-2.5 h-6 w-6 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.1} />
                {checkIn.isLocationConfirmed ? "Localização confirmada" : isSubmitting ? "Realizando o check-in..." : "Confirmar localização"}
              </Button>
            </div>
          )}
        </main>

        <ExecutionConfirmDialog
          confirmLabel="Confirmar"
          description="Tem certeza que deseja realizar o check-in desta ação?"
          icon={<CircleCheckBig className="h-6 w-6" strokeWidth={2.1} />}
          isSubmitting={isSubmitting}
          onCancel={() => setIsConfirmDialogOpen(false)}
          onConfirm={() => void handleConfirmLocation()}
          open={isConfirmDialogOpen}
          title="Confirmar check-in"
          variant="secondary"
        />
      </div>
    </ProtectedRoleRoute>
  );
}