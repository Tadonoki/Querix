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
    <Card className="max-lg:w-full max-lg:max-w-full max-lg:min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base max-lg:min-w-0 lg:text-xl">
          <Database className="h-5 w-5 text-secondary" aria-hidden="true" />
          <span className="max-lg:min-w-0 max-lg:break-words">Skema Database</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-lg:min-w-0">
        {tables.map((table) => (
          <div
            key={table.name}
            className={cn(
              "rounded-lg border bg-white p-4 max-lg:w-full max-lg:max-w-full max-lg:min-w-0 lg:p-5",
              highlightTable === table.name && "border-secondary/50 bg-blue-50/40"
            )}
          >
            <div className="flex items-center justify-between gap-3 max-lg:min-w-0">
              <div className="flex items-center gap-2 max-lg:min-w-0">
                <Table2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="font-semibold max-lg:min-w-0 max-lg:break-words lg:text-lg">
                  {table.name}
                </p>
              </div>
              {highlightTable === table.name ? (
                <Badge variant="secondary" className="shrink-0">
                  dipakai
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground max-lg:break-words lg:text-base lg:leading-7">
              {table.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {table.columns.map((column) => (
                <Badge key={column} variant="outline" className="max-lg:max-w-full max-lg:break-words">
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
