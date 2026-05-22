import { SqlCell, SqlRow } from "@/lib/mock-sql";
import { cn } from "@/lib/utils";

function formatCell(value: SqlCell) {
  if (typeof value === "number" && value >= 10000) {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  return value;
}

export function ResultTable({
  columns,
  rows,
  compact = false
}: {
  columns: string[];
  rows: SqlRow[];
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-5 text-sm text-muted-foreground lg:p-6 lg:text-base">
        Belum ada hasil. Jalankan query untuk melihat data latihan.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-lg border bg-white">
      <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[360px] border-collapse text-left text-sm sm:min-w-[420px] lg:text-base">
          <thead className="bg-muted text-xs uppercase text-muted-foreground lg:text-sm">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold lg:px-5 lg:py-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${JSON.stringify(row)}-${index}`}
                className={cn(index !== rows.length - 1 && "border-b")}
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className={cn("px-4 py-3 lg:px-5 lg:py-4", compact && "py-2 lg:py-3")}
                  >
                    {formatCell(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
