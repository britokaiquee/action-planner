"use client";

import { useParams, useSearchParams } from "next/navigation";

import { TecnicoCheckInScreen } from "@/modules/actions/presentation/components/tecnico-check-in-screen";

export default function TecnicoCheckInPage() {
  const params = useParams<{ actionId: string | string[] }>();
  const searchParams = useSearchParams();
  const actionId = Array.isArray(params.actionId) ? params.actionId[0] : params.actionId;
  const actionDate = searchParams.get("date") ?? undefined;

  return <TecnicoCheckInScreen actionDate={actionDate} actionId={actionId ?? ""} />;
}