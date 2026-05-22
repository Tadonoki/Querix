"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[260px] items-center justify-center bg-slate-950 text-sm text-slate-300">
      Menyiapkan editor SQL...
    </div>
  )
});

export function SqlEditor({
  value,
  onChange,
  height = "320px",
  className
}: {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-slate-950 shadow-crisp",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-300 lg:px-5 lg:py-2.5 lg:text-sm">
        <span>query.sql</span>
        <span>SQL</span>
      </div>
      <MonacoEditor
        height={height}
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 14, bottom: 14 }
        }}
      />
    </div>
  );
}
