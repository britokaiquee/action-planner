"use client";

import { useParams, useSearchParams } from "next/navigation";

import { TecnicoActionParticipantsScreen } from "@/modules/actions/presentation/components/tecnico-action-participants-screen";

export default function TecnicoActionParticipantsPage() {
  const params = useParams<{ actionId: string | string[] }>();
  const searchParams = useSearchParams();
  const actionId = Array.isArray(params.actionId) ? params.actionId[0] : params.actionId;
  const actionDate = searchParams.get("date") ?? undefined;

  return <TecnicoActionParticipantsScreen actionDate={actionDate} actionId={actionId ?? ""} />;
}