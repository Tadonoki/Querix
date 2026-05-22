import { Challenge, TableName, schemas, tableRows } from "@/lib/data";

export type SqlCell = string | number;
export type SqlRow = Record<string, SqlCell>;

export type QueryResult = {
  columns: string[];
  rows: SqlRow[];
  message: string;
};

export type ValidationResult = {
  status: "success" | "error";
  title: "Benar" | "Belum Tepat";
  message: string;
};

const tableNames: TableName[] = ["pelanggan", "produk", "pesanan"];

export function normalizeSql(query: string) {
  return query
    .replace(/--.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getTableName(normalizedQuery: string): TableName | undefined {
  return tableNames.find((table) =>
    new RegExp(`\\bfrom\\s+${table}\\b`).test(normalizedQuery)
  );
}

function getKnownColumns(table: TableName) {
  return schemas.find((schema) => schema.name === table)?.columns ?? [];
}

function getSelectedColumns(query: string, table: TableName) {
  const normalized = normalizeSql(query);
  const allColumns = getKnownColumns(table);

  if (/select\s+\*/.test(normalized)) {
    return allColumns;
  }

  const selectMatch = normalized.match(/select\s+(.+?)\s+from\s+/);
  if (!selectMatch) {
    return allColumns.slice(0, 2);
  }

  const selectedPart = selectMatch[1];
  const selectedColumns = allColumns.filter((column) =>
    new RegExp(`\\b${column}\\b`).test(selectedPart)
  );

  if (selectedPart.includes("count(")) {
    return selectedColumns.includes("kota")
      ? ["kota", "total"]
      : ["total"];
  }

  if (selectedPart.includes("sum(")) {
    return selectedColumns.includes("tanggal_pesanan")
      ? ["tanggal_pesanan", "total"]
      : ["total"];
  }

  if (selectedPart.includes("avg(")) {
    return ["rata_rata_harga"];
  }

  if (selectedPart.includes("min(") || selectedPart.includes("max(")) {
    return ["termurah", "termahal"];
  }

  return selectedColumns.length > 0 ? selectedColumns : allColumns.slice(0, 2);
}

function pickColumns(rows: readonly object[], columns: string[]) {
  return rows.map((row) =>
    columns.reduce<SqlRow>((picked, column) => {
      const value = (row as Record<string, unknown>)[column];
      picked[column] =
        typeof value === "string" || typeof value === "number" ? value : "";
      return picked;
    }, {})
  );
}

function withSimpleFilters(
  table: TableName,
  rows: readonly SqlRow[],
  normalized: string
) {
  let filteredRows = [...rows];

  if (table === "pelanggan" && normalized.includes("where")) {
    if (normalized.includes("jakarta")) {
      filteredRows = filteredRows.filter((row) => row.kota === "Jakarta");
    }
    if (normalized.includes("bandung")) {
      filteredRows = filteredRows.filter((row) => row.kota === "Bandung");
    }
  }

  return filteredRows;
}

function withSimpleSorting(table: TableName, rows: SqlRow[], normalized: string) {
  const sortedRows = [...rows];

  if (table === "produk" && normalized.includes("order by harga")) {
    sortedRows.sort((a, b) => Number(a.harga) - Number(b.harga));
    if (normalized.includes("desc")) {
      sortedRows.reverse();
    }
  }

  if (table === "pesanan" && normalized.includes("order by tanggal_pesanan")) {
    sortedRows.sort((a, b) =>
      String(a.tanggal_pesanan).localeCompare(String(b.tanggal_pesanan))
    );
    if (normalized.includes("desc")) {
      sortedRows.reverse();
    }
  }

  return sortedRows;
}

function applyLimit(rows: SqlRow[], normalized: string) {
  const limitMatch = normalized.match(/\blimit\s+(\d+)/);
  if (!limitMatch) {
    return rows;
  }

  return rows.slice(0, Number(limitMatch[1]));
}

function countRows(rows: readonly object[], column = "total") {
  return [{ [column]: rows.length }];
}

function totalSales() {
  return [
    {
      total_penjualan: tableRows.pesanan.reduce(
        (total, row) => total + row.total_harga,
        0
      )
    }
  ];
}

function averageProductPrice() {
  const total = tableRows.produk.reduce((sum, row) => sum + row.harga, 0);
  return [{ rata_rata_harga: Math.round(total / tableRows.produk.length) }];
}

function minMaxProductPrice() {
  const prices = tableRows.produk.map((row) => row.harga);
  return [
    {
      termurah: Math.min(...prices),
      termahal: Math.max(...prices)
    }
  ];
}

function distinctCities() {
  return Array.from(new Set(tableRows.pelanggan.map((row) => row.kota))).map(
    (kota) => ({ kota })
  );
}

function groupByKota(totalColumn = "total") {
  const counts = tableRows.pelanggan.reduce<Record<string, number>>((acc, row) => {
    acc[row.kota] = (acc[row.kota] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([kota, total]) => ({
    kota,
    [totalColumn]: total
  }));
}

function groupByKategori() {
  const counts = tableRows.produk.reduce<Record<string, number>>((acc, row) => {
    acc[row.kategori] = (acc[row.kategori] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([kategori, total]) => ({
    kategori,
    total
  }));
}

function salesByDate() {
  const totals = tableRows.pesanan.reduce<Record<string, number>>((acc, row) => {
    acc[row.tanggal_pesanan] = (acc[row.tanggal_pesanan] ?? 0) + row.total_harga;
    return acc;
  }, {});

  return Object.entries(totals).map(([tanggal_pesanan, total]) => ({
    tanggal_pesanan,
    total
  }));
}

function orderCustomerRows() {
  return tableRows.pesanan.map((order) => {
    const customer = tableRows.pelanggan.find(
      (row) => row.id === order.pelanggan_id
    );

    return {
      nama: customer?.nama ?? "Tidak diketahui",
      total_harga: order.total_harga
    };
  });
}

function productPriceCategories() {
  return tableRows.produk.map((product) => ({
    nama_produk: product.nama_produk,
    kategori_harga: product.harga > 400000 ? "Premium" : "Reguler"
  }));
}

function bestSellingProducts() {
  const totals = tableRows.pesanan.reduce<Record<number, number>>((acc, order) => {
    acc[order.produk_id] = (acc[order.produk_id] ?? 0) + order.jumlah;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([productId, total_terjual]) => {
      const product = tableRows.produk.find(
        (row) => row.id === Number(productId)
      );

      return {
        nama_produk: product?.nama_produk ?? "Produk tidak diketahui",
        total_terjual
      };
    })
    .sort((a, b) => b.total_terjual - a.total_terjual);
}

export function getExpectedResultForChallenge(challenge: Challenge): QueryResult {
  const byChallenge: Record<string, QueryResult> = {
    "challenge-apa-itu-sql": {
      columns: ["nama"],
      rows: pickColumns(tableRows.pelanggan, ["nama"]),
      message: "Target hasil query SQL dasar dengan SELECT dan FROM."
    },
    "challenge-select": {
      columns: ["nama", "email"],
      rows: pickColumns(tableRows.pelanggan, ["nama", "email"]),
      message: "Target hasil yang diharapkan untuk latihan SELECT."
    },
    "challenge-memilih-kolom-tertentu": {
      columns: ["nama_produk", "harga"],
      rows: pickColumns(tableRows.produk, ["nama_produk", "harga"]),
      message: "Target hasil ketika hanya kolom produk yang relevan dipilih."
    },
    "challenge-where": {
      columns: ["nama", "kota"],
      rows: pickColumns(
        tableRows.pelanggan.filter((row) => row.kota === "Jakarta"),
        ["nama", "kota"]
      ),
      message: "Target hasil setelah data pelanggan disaring ke kota Jakarta."
    },
    "challenge-order-by": {
      columns: ["nama_produk", "harga"],
      rows: pickColumns(
        [...tableRows.produk].sort((a, b) => b.harga - a.harga),
        ["nama_produk", "harga"]
      ),
      message: "Target hasil ketika produk diurutkan dari harga tertinggi."
    },
    "challenge-limit": {
      columns: ["id", "tanggal_pesanan"],
      rows: pickColumns(
        [...tableRows.pesanan]
          .sort((a, b) => b.tanggal_pesanan.localeCompare(a.tanggal_pesanan))
          .slice(0, 3),
        ["id", "tanggal_pesanan"]
      ),
      message: "Target hasil tiga pesanan terbaru."
    },
    "challenge-distinct": {
      columns: ["kota"],
      rows: distinctCities(),
      message: "Target hasil daftar kota tanpa duplikat."
    },
    "challenge-count": {
      columns: ["total_pelanggan"],
      rows: countRows(tableRows.pelanggan, "total_pelanggan"),
      message: "Target hasil total pelanggan."
    },
    "challenge-sum": {
      columns: ["total_penjualan"],
      rows: totalSales(),
      message: "Target hasil total nilai pesanan."
    },
    "challenge-avg": {
      columns: ["rata_rata_harga"],
      rows: averageProductPrice(),
      message: "Target hasil rata-rata harga produk."
    },
    "challenge-min-max": {
      columns: ["termurah", "termahal"],
      rows: minMaxProductPrice(),
      message: "Target hasil harga termurah dan termahal."
    },
    "challenge-group-by": {
      columns: ["kota", "total"],
      rows: groupByKota(),
      message: "Target hasil jumlah pelanggan untuk setiap kota."
    },
    "challenge-having": {
      columns: ["kota", "total"],
      rows: groupByKota().filter((row) => Number(row.total) > 1),
      message: "Target hasil kota dengan jumlah pelanggan lebih dari satu."
    },
    "challenge-join-dasar": {
      columns: ["nama", "total_harga"],
      rows: orderCustomerRows(),
      message: "Target hasil pesanan yang sudah digabung dengan nama pelanggan."
    },
    "challenge-case-when": {
      columns: ["nama_produk", "kategori_harga"],
      rows: productPriceCategories(),
      message: "Target hasil label harga produk dari CASE WHEN."
    },
    "challenge-analisis-penjualan": {
      columns: ["tanggal_pesanan", "total"],
      rows: salesByDate(),
      message: "Target hasil ringkasan total penjualan harian."
    },
    "challenge-analisis-pelanggan": {
      columns: ["kota", "total_pelanggan"],
      rows: groupByKota("total_pelanggan"),
      message: "Target hasil sebaran pelanggan per kota."
    },
    "challenge-produk-terlaris": {
      columns: ["nama_produk", "total_terjual"],
      rows: bestSellingProducts(),
      message: "Target hasil produk terlaris dari jumlah item terjual."
    }
  };

  return byChallenge[challenge.id] ?? {
    columns: ["pesan"],
    rows: [{ pesan: "Tantangan belum memiliki expected result." }],
    message: "Target hasil belum tersedia."
  };
}

export function runMockQuery(query: string): QueryResult {
  const normalized = normalizeSql(query);

  if (!normalized.includes("select") || !normalized.includes("from")) {
    return {
      columns: ["pesan"],
      rows: [
        {
          pesan: "Mulai dengan pola sederhana: SELECT kolom FROM tabel;"
        }
      ],
      message: "Query belum lengkap, tapi kamu sudah bisa coba lagi."
    };
  }

  if (normalized.includes("join produk") && normalized.includes("sum(")) {
    return {
      columns: ["nama_produk", "total_terjual"],
      rows: bestSellingProducts(),
      message: "Hasil produk terlaris ditampilkan dari data pesanan dan produk."
    };
  }

  if (normalized.includes("join pelanggan")) {
    return {
      columns: ["nama", "total_harga"],
      rows: orderCustomerRows(),
      message: "Hasil JOIN pesanan dan pelanggan berhasil dibuat."
    };
  }

  if (normalized.includes("case") && normalized.includes("when")) {
    return {
      columns: ["nama_produk", "kategori_harga"],
      rows: productPriceCategories(),
      message: "Hasil CASE WHEN berhasil dibuat dari data produk."
    };
  }

  if (normalized.includes("distinct") && normalized.includes("kota")) {
    return {
      columns: ["kota"],
      rows: distinctCities(),
      message: "Hasil DISTINCT menampilkan kota tanpa duplikat."
    };
  }

  if (normalized.includes("min(") || normalized.includes("max(")) {
    return {
      columns: ["termurah", "termahal"],
      rows: minMaxProductPrice(),
      message: "Hasil MIN dan MAX ditampilkan dari data produk."
    };
  }

  if (normalized.includes("avg(")) {
    return {
      columns: ["rata_rata_harga"],
      rows: averageProductPrice(),
      message: "Hasil AVG ditampilkan dari data produk."
    };
  }

  if (
    normalized.includes("sum(") &&
    normalized.includes("total_harga") &&
    normalized.includes("group by tanggal_pesanan")
  ) {
    return {
      columns: ["tanggal_pesanan", "total"],
      rows: salesByDate(),
      message: "Hasil ringkasan penjualan harian berhasil dibuat."
    };
  }

  if (normalized.includes("sum(") && normalized.includes("total_harga")) {
    return {
      columns: ["total_penjualan"],
      rows: totalSales(),
      message: "Hasil SUM ditampilkan dari data pesanan."
    };
  }

  if (
    normalized.includes("count(") &&
    normalized.includes("group by kota") &&
    normalized.includes("having")
  ) {
    return {
      columns: ["kota", "total"],
      rows: groupByKota().filter((row) => Number(row.total) > 1),
      message: "Hasil HAVING ditampilkan dari data pelanggan."
    };
  }

  if (normalized.includes("count(") && normalized.includes("group by kota")) {
    return {
      columns: ["kota", "total"],
      rows: groupByKota(),
      message: "Hasil GROUP BY ditampilkan dari data pelanggan."
    };
  }

  if (
    normalized.includes("count(") &&
    normalized.includes("group by kategori")
  ) {
    return {
      columns: ["kategori", "total"],
      rows: groupByKategori(),
      message: "Hasil GROUP BY ditampilkan dari data produk."
    };
  }

  if (normalized.includes("count(") && normalized.includes("from pelanggan")) {
    return {
      columns: ["total_pelanggan"],
      rows: countRows(tableRows.pelanggan, "total_pelanggan"),
      message: "Hasil COUNT ditampilkan dari data pelanggan."
    };
  }

  const table = getTableName(normalized);
  if (!table) {
    return {
      columns: ["pesan"],
      rows: [
        {
          pesan: "Tabel belum dikenali. Coba pakai pelanggan, produk, atau pesanan."
        }
      ],
      message: "Querix memakai data latihan lokal."
    };
  }

  const selectedColumns = getSelectedColumns(query, table);
  const sourceRows = tableRows[table] as readonly SqlRow[];
  const filteredRows = withSimpleFilters(table, sourceRows, normalized);
  const sortedRows = withSimpleSorting(table, filteredRows, normalized);
  const limitedRows = applyLimit(sortedRows, normalized);

  return {
    columns: selectedColumns,
    rows: pickColumns(limitedRows, selectedColumns),
    message: "Hasil query mock berhasil dibuat dari data latihan."
  };
}

function hasRequiredColumns(normalized: string, challenge: Challenge) {
  return challenge.requiredColumns.every((column) =>
    new RegExp(`\\b${column}\\b`).test(normalized)
  );
}

function missingColumnMessage(normalized: string, challenge: Challenge) {
  const missingColumn = challenge.requiredColumns.find(
    (column) => !new RegExp(`\\b${column}\\b`).test(normalized)
  );

  if (missingColumn) {
    return `Hampir benar. Kamu belum memilih kolom ${missingColumn}.`;
  }

  return "Belum tepat. Cek lagi kolom, tabel, dan kondisi yang diminta.";
}

function includesEvery(normalized: string, fragments: string[]) {
  return fragments.every((fragment) => normalized.includes(fragment));
}

function error(message: string): ValidationResult {
  return {
    status: "error",
    title: "Belum Tepat",
    message
  };
}

export function validateChallenge(
  query: string,
  challenge: Challenge
): ValidationResult {
  const normalized = normalizeSql(query);

  if (!normalized.includes("select")) {
    return error("Query perlu dimulai dengan SELECT agar bisa mengambil data.");
  }

  if (!normalized.includes("from")) {
    return error("Kamu sudah memilih kolom, tapi belum menulis FROM.");
  }

  if (!new RegExp(`\\bfrom\\s+${challenge.table}\\b`).test(normalized)) {
    return error(`Pastikan kamu mengambil data dari tabel ${challenge.table}.`);
  }

  if (/select\s+\*/.test(normalized) && challenge.requiredColumns.length > 0) {
    return error(
      "Untuk latihan ini, pilih nama kolom yang diminta secara spesifik, bukan SELECT *."
    );
  }

  if (!hasRequiredColumns(normalized, challenge)) {
    return error(missingColumnMessage(normalized, challenge));
  }

  switch (challenge.id) {
    case "challenge-where":
      if (!includesEvery(normalized, ["where", "kota", "jakarta"])) {
        return error(
          "Kamu sudah memilih tabel pelanggan, tapi belum menyaring kota Jakarta."
        );
      }
      break;
    case "challenge-order-by":
      if (
        !(normalized.includes("order by harga") && normalized.includes("desc"))
      ) {
        return error(
          "Gunakan ORDER BY harga DESC agar produk termahal muncul paling atas."
        );
      }
      break;
    case "challenge-limit":
      if (
        !(
          normalized.includes("order by tanggal_pesanan") &&
          normalized.includes("desc") &&
          normalized.includes("limit 3")
        )
      ) {
        return error(
          "Tambahkan ORDER BY tanggal_pesanan DESC dan LIMIT 3 untuk melihat pesanan terbaru."
        );
      }
      break;
    case "challenge-distinct":
      if (!(normalized.includes("distinct") && normalized.includes("kota"))) {
        return error("Gunakan SELECT DISTINCT kota untuk menghapus duplikat.");
      }
      break;
    case "challenge-count":
      if (!normalized.includes("count(")) {
        return error("Gunakan COUNT(*) untuk menghitung total pelanggan.");
      }
      break;
    case "challenge-sum":
      if (
        !(normalized.includes("sum(") && normalized.includes("total_harga"))
      ) {
        return error("Gunakan SUM(total_harga) untuk menjumlahkan nilai pesanan.");
      }
      break;
    case "challenge-avg":
      if (!(normalized.includes("avg(") && normalized.includes("harga"))) {
        return error("Gunakan AVG(harga) untuk menghitung rata-rata harga.");
      }
      break;
    case "challenge-min-max":
      if (
        !(
          normalized.includes("min(") &&
          normalized.includes("max(") &&
          normalized.includes("harga")
        )
      ) {
        return error("Gunakan MIN(harga) dan MAX(harga) dalam query yang sama.");
      }
      break;
    case "challenge-group-by":
    case "challenge-analisis-pelanggan":
      if (
        !(normalized.includes("count(") && normalized.includes("group by kota"))
      ) {
        return error(
          "Untuk ringkasan per kota, gunakan COUNT(*) dan GROUP BY kota."
        );
      }
      break;
    case "challenge-having":
      if (
        !(
          normalized.includes("count(") &&
          normalized.includes("group by kota") &&
          normalized.includes("having") &&
          normalized.includes("> 1")
        )
      ) {
        return error(
          "Gunakan COUNT(*), GROUP BY kota, lalu HAVING COUNT(*) > 1."
        );
      }
      break;
    case "challenge-join-dasar":
      if (
        !(
          normalized.includes("join pelanggan") &&
          normalized.includes("on") &&
          normalized.includes("pelanggan_id")
        )
      ) {
        return error(
          "Gunakan JOIN pelanggan dan hubungkan pelanggan.id dengan pesanan.pelanggan_id."
        );
      }
      break;
    case "challenge-case-when":
      if (
        !includesEvery(normalized, ["case", "when", "harga", "end"]) ||
        !(normalized.includes("premium") && normalized.includes("reguler"))
      ) {
        return error(
          "Gunakan CASE WHEN harga > 400000 THEN 'Premium' ELSE 'Reguler' END."
        );
      }
      break;
    case "challenge-analisis-penjualan":
      if (
        !(
          normalized.includes("sum(") &&
          normalized.includes("total_harga") &&
          normalized.includes("group by tanggal_pesanan")
        )
      ) {
        return error(
          "Gunakan SUM(total_harga) dan GROUP BY tanggal_pesanan untuk ringkasan harian."
        );
      }
      break;
    case "challenge-produk-terlaris":
      if (
        !(
          normalized.includes("join produk") &&
          normalized.includes("sum(") &&
          normalized.includes("jumlah") &&
          normalized.includes("group by") &&
          normalized.includes("order by")
        )
      ) {
        return error(
          "Gunakan JOIN produk, SUM(jumlah), GROUP BY nama_produk, dan ORDER BY total_terjual DESC."
        );
      }
      break;
  }

  return {
    status: "success",
    title: "Benar",
    message: challenge.successFeedback
  };
}
