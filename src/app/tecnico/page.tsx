import Link from "next/link";

export default function TecnicoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <p className="text-[1.1rem] font-medium text-[#49566b]">Em construção</p>
      <Link className="text-sm font-semibold text-tecnico underline underline-offset-2" href="/tecnico/login">
        Voltar ao login
      </Link>
    </main>
  );
}
