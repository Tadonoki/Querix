import { Database, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchemaTable, schemas, TableName } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SchemaExplorer({
  tables = schemas,
  highlightTable
}: {
  tables?: SchemaTable[];
  highlightTable?: TableName;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base lg:text-xl">
          <Database className="h-5 w-5 text-secondary" aria-hidden="true" />
          Skema Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tables.map((table) => (
          <div
            key={table.name}
            className={cn(
              "rounded-lg border bg-white p-4 lg:p-5",
              highlightTable === table.name && "border-secondary/50 bg-blue-50/40"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Table2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <p className="font-semibold lg:text-lg">{table.name}</p>
              </div>
              {highlightTable === table.name ? (
                <Badge variant="secondary">dipakai</Badge>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
              {table.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {table.columns.map((column) => (
                <Badge key={column} variant="outline">
                  {column}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
