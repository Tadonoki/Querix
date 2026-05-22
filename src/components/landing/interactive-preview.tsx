"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ResultTable } from "@/components/result-table";

const previewRows = [
  { nama: "Andi Pratama", kota: "Jakarta" },
  { nama: "Budi Santoso", kota: "Jakarta" }
];

export function InteractivePreview() {
  const [running, setRunning] = useState(false);

  function handleRun() {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 650);
  }

  return (
    <div className="grid min-w-0 items-stretch gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
      <div className="min-w-0 rounded-lg border bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100 shadow-crisp lg:p-7 lg:text-base lg:leading-8">
        <div className="max-w-full overflow-x-auto">
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
        <Button
          className="mt-6 w-full sm:w-auto"
          variant="secondary"
          onClick={handleRun}
          disabled={running}
        >
          {running ? (
            <LoadingSpinner />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {running ? "Menjalankan query..." : "Jalankan Query"}
        </Button>
      </div>
      <div className="min-w-0 space-y-3">
        <p className="text-sm font-semibold text-muted-foreground lg:text-base">
          Hasil Query
        </p>
        {running ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-lg border bg-white text-sm font-semibold text-primary lg:min-h-[180px] lg:text-base">
            <LoadingSpinner className="mr-2 text-secondary" />
            Menjalankan query...
          </div>
        ) : (
          <ResultTable columns={["nama", "kota"]} rows={previewRows} />
        )}
      </div>
    </div>
  );
}
