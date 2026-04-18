import { CalendarX2 } from "lucide-react";

interface TecnicoDashboardEmptyStateProps {
  description: string;
  title?: string;
}

export function TecnicoDashboardEmptyState({ title, description }: TecnicoDashboardEmptyStateProps) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-4 px-6 py-8 text-center sm:gap-5 sm:py-10">
      <div className="flex h-14 w-14 items-center justify-center text-[#cfd6e2] sm:h-16 sm:w-16">
        <CalendarX2 className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.9} />
      </div>

      <div className="space-y-1.5">
        {title ? <h3 className="text-[1.3rem] font-semibold tracking-[-0.03em] text-text-strong sm:text-[2rem]">{title}</h3> : null}
        <p className="max-w-[34rem] text-[0.95rem] leading-relaxed text-[#9ba6b8] sm:text-[1.35rem]">{description}</p>
      </div>
    </div>
  );
}