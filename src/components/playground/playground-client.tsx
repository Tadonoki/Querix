"use client";

import { useState } from "react";
import { DatabaseZap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultTable } from "@/components/result-table";
import { SchemaExplorer } from "@/components/schema-explorer";
import { SqlEditor } from "@/components/sql-editor";
import { QueryResult, runMockQuery } from "@/lib/mock-sql";

const sampleQueries = [
  "SELECT * FROM pelanggan;",
  "SELECT nama, kota FROM pelanggan;",
  "SELECT kategori, COUNT(*) FROM produk GROUP BY kategori;"
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function runQuery(query: string) {
  return runMockQuery(query);
}

export function PlaygroundClient() {
  const [query, setQuery] = useState(sampleQueries[0]);
  const [result, setResult] = useState<QueryResult>(() =>
    runMockQuery(sampleQueries[0])
  );
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    try {
      const [nextResult] = await Promise.all([runQuery(query), wait(650)]);
      setResult(nextResult);
    } catch {
      setResult(runMockQuery(query));
    } finally {
      setRunning(false);
    }
  }

  function handleSample(nextQuery: string) {
    setQuery(nextQuery);
    setResult(runMockQuery(nextQuery));
  }

  return (
    <main className="bg-querix-paper py-10 lg:py-14 max-md:w-full max-md:max-w-full max-md:overflow-hidden">
      <div className="container space-y-8 lg:space-y-10">
        <section className="max-w-4xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground lg:h-14 lg:w-14">
            <DatabaseZap className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-primary sm:text-4xl lg:text-5xl">
            Playground SQL
          </h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground lg:mt-4 lg:max-w-3xl lg:text-xl lg:leading-9">
            Area bebas untuk mencoba query SQL sederhana menggunakan data
            latihan Querix.
          </p>
          <Badge variant="accent" className="mt-4">
            Playground ini menggunakan data latihan, bukan database asli.
          </Badge>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr] xl:gap-8 max-md:w-full max-md:max-w-full max-md:min-w-0">
          <div className="space-y-5 lg:space-y-6 max-md:w-full max-md:max-w-full max-md:min-w-0">
            <SchemaExplorer />
            <Card className="max-md:w-full max-md:max-w-full max-md:min-w-0 max-md:overflow-hidden">
              <CardHeader>
                <CardTitle>Contoh Query</CardTitle>
                <CardDescription>
                  Pilih salah satu contoh untuk mengisi editor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleQueries.map((sample) => (
                  <button
                    key={sample}
                    className="w-full rounded-lg border bg-white p-3 text-left font-mono text-sm leading-6 transition hover:border-secondary hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:p-4 lg:text-[15px] lg:leading-7 whitespace-normal break-all md:break-words"
                    onClick={() => handleSample(sample)}
                  >
                    {sample}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5 lg:space-y-6 max-md:w-full max-md:max-w-full max-md:min-w-0">
            <Card className="max-md:w-full max-md:max-w-full max-md:min-w-0 max-md:overflow-hidden">
              <CardHeader>
                <CardTitle>Editor SQL</CardTitle>
                <CardDescription>
                  Coba SELECT, WHERE, ORDER BY, LIMIT, dan GROUP BY sederhana.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SqlEditor value={query} onChange={setQuery} height="430px" className="max-md:w-full max-md:max-w-full max-md:min-w-0" />
                <Button onClick={handleRun} variant="secondary" disabled={running}>
                  {running ? (
                    <LoadingSpinner />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  )}
                  {running ? "Menjalankan query..." : "Jalankan Query"}
                </Button>
              </CardContent>
            </Card>

            <Card className="max-md:w-full max-md:max-w-full max-md:min-w-0 max-md:overflow-hidden">
              <CardHeader>
                <CardTitle>Hasil Query</CardTitle>
                <CardDescription>
                  {running ? "Menjalankan query..." : result.message}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-md:w-full max-md:max-w-full max-md:min-w-0 max-md:overflow-hidden">
                {running ? (
                  <div className="flex min-h-[160px] items-center justify-center rounded-lg border bg-white text-sm font-semibold text-primary max-md:w-full max-md:max-w-full max-md:min-w-0">
                    <LoadingSpinner className="mr-2 text-secondary" />
                    Menjalankan query...
                  </div>
                ) : (
                  <ResultTable columns={result.columns} rows={result.rows} />
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
