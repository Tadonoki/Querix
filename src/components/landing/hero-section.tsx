import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingLinkButton } from "@/components/loading-link-button";
import { ResultTable } from "@/components/result-table";

const previewRows = [
  { nama: "Andi Pratama", kota: "Jakarta" },
  { nama: "Budi Santoso", kota: "Jakarta" }
];

export function HeroSection() {
  return (
    <section className="query-grid relative isolate overflow-hidden border-b bg-querix-paper">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/35" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.95fr)] lg:gap-16 lg:px-8 lg:py-[4.5rem] xl:grid-cols-[minmax(0,1fr)_minmax(580px,0.98fr)] xl:gap-[4.5rem]">
        <div className="min-w-0 max-w-[780px]">
          <Badge
            variant="accent"
            className="mb-5 max-w-full gap-2 whitespace-normal leading-5"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Platform Belajar SQL Interaktif Bahasa Indonesia
          </Badge>
          <h1 className="max-w-[780px] text-balance text-4xl font-bold leading-tight tracking-normal text-primary sm:text-5xl lg:text-[3rem] lg:leading-[1.06] xl:text-[4.5rem] xl:leading-[1.04]">
            Belajar SQL dari Nol, Langsung Praktik
          </h1>
          <p className="mt-5 max-w-[700px] break-words text-base leading-8 text-muted-foreground sm:text-lg lg:mt-7 lg:text-[1.35rem] lg:leading-9">
            Querix membantu kamu memahami SQL dengan penjelasan sederhana,
            latihan interaktif, dan contoh kasus Data Analyst dunia nyata.
          </p>
          <div className="mt-7 grid w-full gap-3 sm:flex sm:w-auto lg:mt-10 lg:gap-4">
            <LoadingLinkButton
              href="/learn"
              size="lg"
              loadingText="Memuat..."
              className="lg:h-14 lg:px-8 lg:text-lg"
            >
              Mulai Belajar Gratis
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </LoadingLinkButton>
            <LoadingLinkButton
              href="/challenges"
              variant="outline"
              size="lg"
              loadingText="Memuat tantangan..."
              className="lg:h-14 lg:px-8 lg:text-lg"
            >
              Lihat Tantangan SQL
            </LoadingLinkButton>
          </div>
        </div>

        <div className="relative min-w-0 overflow-hidden lg:justify-self-end">
          <div className="w-full max-w-full rounded-lg border bg-white/92 p-3 shadow-crisp backdrop-blur sm:p-4 lg:max-w-[700px] lg:p-7 xl:max-w-[740px] xl:p-8">
            <div className="max-w-full overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100 sm:p-5 lg:p-8 lg:text-[1.15rem] lg:leading-9">
              <p>
                <span className="text-sky-300">SELECT</span> nama, kota
              </p>
              <p>
                <span className="text-sky-300">FROM</span> pelanggan
              </p>
              <p>
                <span className="text-sky-300">WHERE</span> kota ={" "}
                <span className="text-yellow-200">&apos;Jakarta&apos;</span>;
              </p>
            </div>
            <div className="mt-5 min-w-0">
              <ResultTable
                columns={["nama", "kota"]}
                rows={previewRows}
              />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 text-center text-sm sm:grid-cols-3 lg:max-w-[700px] lg:text-lg xl:max-w-[740px]">
            {["SELECT", "WHERE", "GROUP BY"].map((item) => (
              <div key={item} className="rounded-lg border bg-white px-3 py-3 lg:py-5 xl:py-6">
                <p className="font-semibold text-primary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
