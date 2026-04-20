"use client";

import { useParams, useSearchParams } from "next/navigation";

import { TecnicoActionParticipantsScreen } from "@/modules/actions/presentation/components/tecnico-action-participants-screen";

export default function TecnicoActionParticipantsPage() {
  const params = useParams<{ actionId: string | string[] }>();
  const searchParams = useSearchParams();
  const actionId = Array.isArray(params.actionId) ? params.actionId[0] : params.actionId;
  const actionDate = searchParams.get("date") ?? undefined;
  const origin = searchParams.get("origin") === "checkout" ? "check-out" : "check-in";
  const transientCheckInTimestamp = searchParams.get("checkInAt") ?? undefined;

  return (
    <TecnicoActionParticipantsScreen
      actionDate={actionDate}
      actionId={actionId ?? ""}
      origin={origin}
      transientCheckInTimestamp={transientCheckInTimestamp}
    />
  );
}