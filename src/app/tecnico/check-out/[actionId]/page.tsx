"use client";

import { useParams, useSearchParams } from "next/navigation";

import { TecnicoCheckOutScreen } from "@/modules/actions/presentation/components/tecnico-check-out-screen";

export default function TecnicoCheckOutPage() {
  const params = useParams<{ actionId: string | string[] }>();
  const searchParams = useSearchParams();
  const actionId = Array.isArray(params.actionId) ? params.actionId[0] : params.actionId;
  const actionDate = searchParams.get("date") ?? undefined;
  const transientCheckInTimestamp = searchParams.get("checkInAt") ?? undefined;

  return <TecnicoCheckOutScreen actionDate={actionDate} actionId={actionId ?? ""} transientCheckInTimestamp={transientCheckInTimestamp} />;
}