"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { ArrowLeft, CalendarDays, CircleCheckBig, Clock3, MapPin, UsersRound } from "lucide-react";

import { getTecnicoCheckIn, type TecnicoCheckInViewModel } from "@/modules/actions/application/get-tecnico-check-in";
import { registerActionExecution } from "@/modules/actions/application/register-action-execution";
import { actionRepository } from "@/modules/actions/infrastructure/mock-action-repository";
import { useAuth } from "@/modules/auth/presentation/auth-provider";
import { ProtectedRoleRoute } from "@/modules/auth/presentation/components/route-guard";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

interface TecnicoCheckInScreenProps {
  actionId: string;
  actionDate?: string;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[4rem] items-start gap-3 sm:min-h-[4.2rem]">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#98A2B3] sm:h-7 sm:w-7">{icon}</div>

      <div className="min-w-0 space-y-1">
        <p className="text-[0.88rem] font-medium tracking-[-0.02em] text-text-strong sm:text-[0.95rem]">{label}</p>
        <p className="text-[0.98rem] leading-snug text-text-muted sm:text-[1.02rem]">{value}</p>
      </div>
    </div>
  );
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
  const [checkIn, setCheckIn] = useState<TecnicoCheckInViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleConfirmLocation() {
    if (!user?.name || !checkIn || checkIn.isLocationConfirmed || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    await registerActionExecution(actionRepository, {
      actionId: checkIn.actionId,
      actionDate: checkIn.actionDate,
      technicianName: user.name,
      type: "check-in",
    });

    const nextCheckIn = await getTecnicoCheckIn(actionRepository, {
      actionId: checkIn.actionId,
      actionDate: checkIn.actionDate,
      technicianName: user.name,
    });

    setCheckIn(nextCheckIn);
    setIsSubmitting(false);
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
                <Button className="mt-2" onClick={() => window.location.assign("/tecnico")} variant="secondary">
                  Voltar ao dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mx-auto flex min-h-[calc(100vh-8.75rem-2.25rem)] w-full max-w-[32rem] flex-col gap-4 sm:min-h-[calc(100vh-9.5rem-2.75rem)] lg:max-w-[39.5rem]">
              <Card className="w-full rounded-[1.15rem] border-[#d9dfe8] shadow-[0_2px_8px_rgba(16,24,40,0.06),0_3px_8px_rgba(16,24,40,0.04)]">
                <CardContent className="flex min-h-[15.4rem] flex-col gap-3 p-[1.1rem] sm:min-h-[16rem] sm:p-5 lg:min-h-[15rem] lg:p-[1.35rem]">
                  <div>
                    <h2 className="text-[1.28rem] font-semibold leading-[1.02] tracking-[-0.04em] text-text-strong sm:text-[1.42rem] lg:text-[1.24rem]">
                      Informações da Ação
                    </h2>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2.5 sm:gap-3">
                    <InfoRow icon={<MapPin className="h-6 w-6" strokeWidth={2} />} label="Local" value={checkIn.locationLabel} />
                    <InfoRow icon={<Clock3 className="h-6 w-6" strokeWidth={2} />} label="Horário" value={checkIn.timeLabel} />
                    <InfoRow icon={<CalendarDays className="h-6 w-6" strokeWidth={2} />} label="Data" value={checkIn.dateLabel} />

                    <Link
                      className="inline-flex h-[2.85rem] min-h-[2.85rem] w-fit items-center justify-center gap-2 self-start rounded-[1rem] border border-border bg-[#f8f9fc] px-4 text-[0.98rem] font-medium text-text-strong transition hover:bg-[#f2f5fa]"
                      href={checkIn.actionDate ? `/tecnico/check-in/${checkIn.actionId}/participantes?date=${checkIn.actionDate}` : `/tecnico/check-in/${checkIn.actionId}/participantes`}
                    >
                      <UsersRound className="h-5 w-5 text-tecnico" strokeWidth={2.1} />
                      Participantes
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full rounded-[1.15rem] border-[#d9dfe8] shadow-[0_2px_8px_rgba(16,24,40,0.06),0_3px_8px_rgba(16,24,40,0.04)]">
                <CardContent className="flex min-h-[17.1rem] flex-col gap-3 p-[1.1rem] sm:min-h-[17.8rem] sm:p-5 lg:min-h-[16.7rem] lg:p-[1.35rem]">
                  <div>
                    <h2 className="text-[1.28rem] font-semibold leading-[1.02] tracking-[-0.04em] text-text-strong sm:text-[1.42rem] lg:text-[1.24rem]">Recursos</h2>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 sm:gap-2.5">
                    {checkIn.resources.map((resource) => (
                      <div
                        className="flex min-h-[3rem] items-center gap-4 rounded-[0.95rem] bg-[#f8f9fc] px-4 py-2.5 sm:min-h-[3.15rem] sm:px-4 sm:py-2.5 lg:min-h-[3.35rem] lg:px-5"
                        key={resource.id}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-tecnico" />
                          <span className="text-[0.95rem] font-medium leading-snug text-text-strong sm:text-[0.98rem] lg:text-[0.97rem]">{`${resource.label} (${resource.quantityLabel})`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                className={cn(
                  "mx-auto h-[3.8rem] min-h-[3.8rem] w-fit rounded-[2rem] px-5 text-[1.05rem] font-semibold shadow-[0_12px_24px_rgba(37,99,235,0.22)] sm:h-[3.9rem] sm:min-h-[3.9rem] sm:text-[1.12rem] lg:h-[3.95rem] lg:min-h-[3.95rem]",
                  checkIn.isLocationConfirmed ? "bg-tecnico-dark" : undefined,
                )}
                disabled={checkIn.isLocationConfirmed || isSubmitting}
                onClick={handleConfirmLocation}
                variant="secondary"
              >
                <CircleCheckBig className="mr-2.5 h-6 w-6 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.1} />
                {checkIn.isLocationConfirmed ? "Localização confirmada" : isSubmitting ? "Confirmando localização..." : "Confirmar localização"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoleRoute>
  );
}