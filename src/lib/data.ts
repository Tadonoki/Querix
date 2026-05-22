import {
  BookOpen,
  Brain,
  CheckCircle2,
  Database,
  Filter,
  GraduationCap,
  LineChart,
  ListOrdered,
  LucideIcon,
  PlayCircle,
  Table2
} from "lucide-react";

export type Difficulty = "Mudah" | "Menengah";
export type TableName = "pelanggan" | "produk" | "pesanan";

export type Lesson = {
  id: string;
  slug: string;
  challengeId: string;
  level: "Level 1 - SQL Dasar" | "Level 2 - Agregasi Data" | "Level 3 - Data Analyst Case";
  title: string;
  shortTitle: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  concept: string;
  beginnerExplanation: string;
  syntax: string;
  example: string;
  exampleColumns: string[];
  exampleRows: Record<string, string | number>[];
  commonMistakes: string[];
};

export type Challenge = {
  id: string;
  lessonId: string;
  slug: string;
  title: string;
  description: string;
  story: string;
  task: string;
  topic: string;
  difficulty: Difficulty;
  table: TableName;
  requiredColumns: string[];
  expectedInfo: string;
  starterQuery: string;
  hints: string[];
  successFeedback: string;
};

export type SchemaTable = {
  name: TableName;
  description: string;
  columns: string[];
};

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const userProfile = {
  name: "Kgs M Luthfi",
  level: "Beginner SQL Learner"
};

export const tableRows = {
  pelanggan: [
    {
      id: 1,
      nama: "Andi Pratama",
      email: "andi@email.com",
      kota: "Jakarta",
      tanggal_daftar: "2024-01-12"
    },
    {
      id: 2,
      nama: "Sari Lestari",
      email: "sari@email.com",
      kota: "Bandung",
      tanggal_daftar: "2024-01-18"
    },
    {
      id: 3,
      nama: "Budi Santoso",
      email: "budi@email.com",
      kota: "Jakarta",
      tanggal_daftar: "2024-02-01"
    },
    {
      id: 4,
      nama: "Rina Wijaya",
      email: "rina@email.com",
      kota: "Surabaya",
      tanggal_daftar: "2024-02-10"
    },
    {
      id: 5,
      nama: "Dimas Putra",
      email: "dimas@email.com",
      kota: "Medan",
      tanggal_daftar: "2024-03-05"
    }
  ],
  produk: [
    {
      id: 1,
      nama_produk: "Keyboard Mechanical",
      kategori: "Aksesoris",
      harga: 450000,
      stok: 25
    },
    {
      id: 2,
      nama_produk: "Mouse Wireless",
      kategori: "Aksesoris",
      harga: 150000,
      stok: 40
    },
    {
      id: 3,
      nama_produk: "Monitor 24 inch",
      kategori: "Elektronik",
      harga: 1800000,
      stok: 12
    },
    {
      id: 4,
      nama_produk: "Laptop Stand",
      kategori: "Aksesoris",
      harga: 220000,
      stok: 30
    },
    {
      id: 5,
      nama_produk: "Webcam HD",
      kategori: "Elektronik",
      harga: 350000,
      stok: 18
    }
  ],
  pesanan: [
    {
      id: 1,
      pelanggan_id: 1,
      produk_id: 2,
      jumlah: 1,
      total_harga: 150000,
      tanggal_pesanan: "2024-03-10"
    },
    {
      id: 2,
      pelanggan_id: 2,
      produk_id: 1,
      jumlah: 1,
      total_harga: 450000,
      tanggal_pesanan: "2024-03-12"
    },
    {
      id: 3,
      pelanggan_id: 3,
      produk_id: 3,
      jumlah: 1,
      total_harga: 1800000,
      tanggal_pesanan: "2024-03-15"
    },
    {
      id: 4,
      pelanggan_id: 1,
      produk_id: 4,
      jumlah: 2,
      total_harga: 440000,
      tanggal_pesanan: "2024-03-18"
    },
    {
      id: 5,
      pelanggan_id: 4,
      produk_id: 5,
      jumlah: 1,
      total_harga: 350000,
      tanggal_pesanan: "2024-03-20"
    }
  ]
} as const;

export const schemas: SchemaTable[] = [
  {
    name: "pelanggan",
    description: "Data pelanggan yang bisa digunakan untuk latihan SELECT dan WHERE.",
    columns: ["id", "nama", "email", "kota", "tanggal_daftar"]
  },
  {
    name: "produk",
    description: "Daftar produk toko latihan untuk sorting dan agregasi sederhana.",
    columns: ["id", "nama_produk", "kategori", "harga", "stok"]
  },
  {
    name: "pesanan",
    description: "Data transaksi sederhana untuk kasus Data Analyst.",
    columns: [
      "id",
      "pelanggan_id",
      "produk_id",
      "jumlah",
      "total_harga",
      "tanggal_pesanan"
    ]
  }
];

export const landingFeatures: Feature[] = [
  {
    title: "Bahasa Indonesia",
    description: "Materi dijelaskan dengan bahasa sederhana dan mudah dipahami.",
    icon: GraduationCap
  },
  {
    title: "Langsung Praktik",
    description: "Tulis query SQL langsung di browser dan lihat hasilnya.",
    icon: PlayCircle
  },
  {
    title: "Beginner Friendly",
    description: "Mulai dari SELECT, WHERE, GROUP BY, sampai JOIN.",
    icon: Brain
  },
  {
    title: "Real World Case",
    description: "Latihan memakai contoh kasus yang sering ditemui Data Analyst.",
    icon: LineChart
  }
];

export const learningPath = [
  "SQL Dasar",
  "Filter Data",
  "Sorting & Limit",
  "Aggregation",
  "Grouping",
  "Join Tables",
  "Analyst Case"
];

export const lessons: Lesson[] = [
  {
    id: "lesson-apa-itu-sql",
    slug: "apa-itu-sql",
    challengeId: "challenge-apa-itu-sql",
    level: "Level 1 - SQL Dasar",
    title: "Apa itu SQL?",
    shortTitle: "Apa itu SQL?",
    description: "Kenali SQL sebagai bahasa untuk bertanya ke tabel data.",
    difficulty: "Mudah",
    topic: "SELECT",
    concept: "SQL membantu kamu mengambil dan mengolah data dari tabel.",
    beginnerExplanation:
      "Bayangkan tabel seperti spreadsheet. SQL adalah cara menulis permintaan yang jelas agar komputer tahu data mana yang ingin kamu lihat.",
    syntax: "SELECT nama_kolom\nFROM nama_tabel;",
    example: "SELECT nama, kota\nFROM pelanggan;",
    exampleColumns: ["nama", "kota"],
    exampleRows: [
      { nama: "Andi Pratama", kota: "Jakarta" },
      { nama: "Sari Lestari", kota: "Bandung" }
    ],
    commonMistakes: [
      "Menghafal terlalu banyak istilah sebelum mencoba query sederhana.",
      "Mengira SQL harus langsung rumit.",
      "Lupa bahwa setiap query biasanya membaca dari sebuah tabel."
    ]
  },
  {
    id: "lesson-select",
    slug: "select",
    challengeId: "challenge-select",
    level: "Level 1 - SQL Dasar",
    title: "SELECT: Memilih Data dari Tabel",
    shortTitle: "SELECT",
    description: "Ambil kolom tertentu dari sebuah tabel.",
    difficulty: "Mudah",
    topic: "SELECT",
    concept: "SELECT digunakan untuk mengambil kolom tertentu dari sebuah tabel.",
    beginnerExplanation:
      "Bayangkan kamu punya tabel pelanggan. Jika kamu hanya ingin melihat nama dan email pelanggan, gunakan SELECT untuk memilih dua kolom itu saja.",
    syntax: "SELECT nama_kolom\nFROM nama_tabel;",
    example: "SELECT nama, email\nFROM pelanggan;",
    exampleColumns: ["nama", "email"],
    exampleRows: [
      { nama: "Andi Pratama", email: "andi@email.com" },
      { nama: "Sari Lestari", email: "sari@email.com" }
    ],
    commonMistakes: [
      "Lupa menulis FROM.",
      "Salah mengetik nama kolom.",
      "Menggunakan SELECT * padahal hanya butuh beberapa kolom."
    ]
  },
  {
    id: "lesson-memilih-kolom-tertentu",
    slug: "memilih-kolom-tertentu",
    challengeId: "challenge-memilih-kolom-tertentu",
    level: "Level 1 - SQL Dasar",
    title: "Memilih Kolom Tertentu",
    shortTitle: "Memilih Kolom",
    description: "Tampilkan hanya kolom yang diperlukan agar hasil lebih rapi.",
    difficulty: "Mudah",
    topic: "SELECT",
    concept: "Kamu bisa menulis beberapa nama kolom setelah SELECT.",
    beginnerExplanation:
      "Untuk laporan kerja, biasanya kamu tidak membutuhkan semua kolom. Pilih kolom yang relevan agar hasil query mudah dibaca.",
    syntax: "SELECT kolom_1, kolom_2\nFROM nama_tabel;",
    example: "SELECT nama_produk, harga\nFROM produk;",
    exampleColumns: ["nama_produk", "harga"],
    exampleRows: [
      { nama_produk: "Keyboard Mechanical", harga: 450000 },
      { nama_produk: "Mouse Wireless", harga: 150000 }
    ],
    commonMistakes: [
      "Memisahkan nama kolom tanpa koma.",
      "Menulis nama tabel di bagian SELECT.",
      "Mengambil terlalu banyak kolom untuk laporan sederhana."
    ]
  },
  {
    id: "lesson-where",
    slug: "where",
    challengeId: "challenge-where",
    level: "Level 1 - SQL Dasar",
    title: "WHERE untuk Filter Data",
    shortTitle: "WHERE",
    description: "Saring baris data yang memenuhi kondisi tertentu.",
    difficulty: "Mudah",
    topic: "WHERE",
    concept: "WHERE digunakan untuk menampilkan baris yang sesuai kondisi.",
    beginnerExplanation:
      "Jika tabel berisi pelanggan dari banyak kota, WHERE membantu kamu melihat pelanggan dari kota tertentu saja.",
    syntax: "SELECT nama_kolom\nFROM nama_tabel\nWHERE kondisi;",
    example: "SELECT nama, kota\nFROM pelanggan\nWHERE kota = 'Jakarta';",
    exampleColumns: ["nama", "kota"],
    exampleRows: [
      { nama: "Andi Pratama", kota: "Jakarta" },
      { nama: "Budi Santoso", kota: "Jakarta" }
    ],
    commonMistakes: [
      "Lupa tanda kutip untuk teks seperti Jakarta.",
      "Menulis satu tanda sama dengan di tempat yang salah.",
      "Menggunakan WHERE sebelum FROM."
    ]
  },
  {
    id: "lesson-order-by",
    slug: "order-by",
    challengeId: "challenge-order-by",
    level: "Level 1 - SQL Dasar",
    title: "ORDER BY: Mengurutkan Data",
    shortTitle: "ORDER BY",
    description: "Urutkan data dari kecil ke besar atau sebaliknya.",
    difficulty: "Mudah",
    topic: "ORDER BY",
    concept: "ORDER BY mengatur urutan baris hasil query.",
    beginnerExplanation:
      "Saat mencari produk termahal, kamu bisa mengurutkan kolom harga dari nilai tertinggi agar hasil paling penting muncul dulu.",
    syntax: "SELECT nama_kolom\nFROM nama_tabel\nORDER BY kolom ASC;",
    example: "SELECT nama_produk, harga\nFROM produk\nORDER BY harga DESC;",
    exampleColumns: ["nama_produk", "harga"],
    exampleRows: [
      { nama_produk: "Monitor 24 inch", harga: 1800000 },
      { nama_produk: "Keyboard Mechanical", harga: 450000 }
    ],
    commonMistakes: [
      "Lupa menulis ASC atau DESC saat urutan perlu jelas.",
      "Mengurutkan kolom yang tidak ada.",
      "Menaruh ORDER BY sebelum WHERE."
    ]
  },
  {
    id: "lesson-limit",
    slug: "limit",
    challengeId: "challenge-limit",
    level: "Level 1 - SQL Dasar",
    title: "LIMIT: Membatasi Jumlah Hasil",
    shortTitle: "LIMIT",
    description: "Ambil beberapa baris pertama dari hasil query.",
    difficulty: "Mudah",
    topic: "LIMIT",
    concept: "LIMIT membatasi jumlah baris yang ditampilkan.",
    beginnerExplanation:
      "Saat tabel sangat panjang, LIMIT membantu kamu melihat contoh data secukupnya tanpa membaca semua baris.",
    syntax: "SELECT nama_kolom\nFROM nama_tabel\nLIMIT jumlah_baris;",
    example: "SELECT id, tanggal_pesanan\nFROM pesanan\nLIMIT 3;",
    exampleColumns: ["id", "tanggal_pesanan"],
    exampleRows: [
      { id: 1, tanggal_pesanan: "2024-03-10" },
      { id: 2, tanggal_pesanan: "2024-03-12" },
      { id: 3, tanggal_pesanan: "2024-03-15" }
    ],
    commonMistakes: [
      "Mengira LIMIT menghapus data asli.",
      "Menulis LIMIT sebelum FROM.",
      "Tidak memakai ORDER BY saat ingin lima data terbaru."
    ]
  },
  {
    id: "lesson-distinct",
    slug: "distinct",
    challengeId: "challenge-distinct",
    level: "Level 1 - SQL Dasar",
    title: "DISTINCT: Nilai Unik",
    shortTitle: "DISTINCT",
    description: "Hilangkan nilai duplikat dari hasil query.",
    difficulty: "Mudah",
    topic: "DISTINCT",
    concept: "DISTINCT menampilkan nilai unik dari kolom yang dipilih.",
    beginnerExplanation:
      "Kalau kamu ingin melihat daftar kota pelanggan tanpa nama kota berulang, DISTINCT adalah alat yang tepat.",
    syntax: "SELECT DISTINCT nama_kolom\nFROM nama_tabel;",
    example: "SELECT DISTINCT kota\nFROM pelanggan;",
    exampleColumns: ["kota"],
    exampleRows: [
      { kota: "Jakarta" },
      { kota: "Bandung" },
      { kota: "Surabaya" }
    ],
    commonMistakes: [
      "Mengira DISTINCT menghitung jumlah data.",
      "Memakai DISTINCT pada terlalu banyak kolom.",
      "Tidak mengecek apakah duplikat memang perlu dihapus."
    ]
  },
  {
    id: "lesson-count",
    slug: "count",
    challengeId: "challenge-count",
    level: "Level 2 - Agregasi Data",
    title: "COUNT: Menghitung Baris",
    shortTitle: "COUNT",
    description: "Hitung jumlah baris atau jumlah data dalam kelompok.",
    difficulty: "Mudah",
    topic: "COUNT",
    concept: "COUNT menghitung berapa banyak baris yang cocok dengan query.",
    beginnerExplanation:
      "Untuk tahu jumlah pelanggan, kamu tidak perlu membaca satu per satu. COUNT memberi angka totalnya.",
    syntax: "SELECT COUNT(*)\nFROM nama_tabel;",
    example: "SELECT COUNT(*) AS total_pelanggan\nFROM pelanggan;",
    exampleColumns: ["total_pelanggan"],
    exampleRows: [{ total_pelanggan: 5 }],
    commonMistakes: [
      "Lupa memberi nama alias agar hasil mudah dibaca.",
      "Mengira COUNT(*) menjumlahkan angka.",
      "Tidak memakai GROUP BY saat ingin hitungan per kategori."
    ]
  },
  {
    id: "lesson-sum",
    slug: "sum",
    challengeId: "challenge-sum",
    level: "Level 2 - Agregasi Data",
    title: "SUM: Menjumlahkan Nilai",
    shortTitle: "SUM",
    description: "Jumlahkan nilai numerik seperti total harga.",
    difficulty: "Mudah",
    topic: "SUM",
    concept: "SUM menjumlahkan nilai dari kolom angka.",
    beginnerExplanation:
      "Jika kamu ingin tahu total penjualan, SUM bisa menjumlahkan seluruh nilai total_harga dari tabel pesanan.",
    syntax: "SELECT SUM(kolom_angka)\nFROM nama_tabel;",
    example: "SELECT SUM(total_harga) AS total_penjualan\nFROM pesanan;",
    exampleColumns: ["total_penjualan"],
    exampleRows: [{ total_penjualan: 3190000 }],
    commonMistakes: [
      "Memakai SUM pada kolom teks.",
      "Lupa memahami satuan angka yang dijumlahkan.",
      "Tidak memberi alias pada hasil agregasi."
    ]
  },
  {
    id: "lesson-avg",
    slug: "avg",
    challengeId: "challenge-avg",
    level: "Level 2 - Agregasi Data",
    title: "AVG: Rata-rata",
    shortTitle: "AVG",
    description: "Cari nilai rata-rata dari kolom angka.",
    difficulty: "Mudah",
    topic: "AVG",
    concept: "AVG menghitung rata-rata nilai numerik.",
    beginnerExplanation:
      "Untuk memahami harga produk rata-rata, AVG memberi gambaran angka tengah tanpa menghitung manual.",
    syntax: "SELECT AVG(kolom_angka)\nFROM nama_tabel;",
    example: "SELECT AVG(harga) AS rata_rata_harga\nFROM produk;",
    exampleColumns: ["rata_rata_harga"],
    exampleRows: [{ rata_rata_harga: 594000 }],
    commonMistakes: [
      "Membaca rata-rata tanpa melihat nilai ekstrem.",
      "Memakai AVG pada kolom ID.",
      "Tidak memberi nama hasil agar mudah dipahami."
    ]
  },
  {
    id: "lesson-min-max",
    slug: "min-max",
    challengeId: "challenge-min-max",
    level: "Level 2 - Agregasi Data",
    title: "MIN & MAX",
    shortTitle: "MIN & MAX",
    description: "Cari nilai terkecil dan terbesar.",
    difficulty: "Mudah",
    topic: "MIN MAX",
    concept: "MIN mencari nilai terkecil, MAX mencari nilai terbesar.",
    beginnerExplanation:
      "Saat mengecek harga produk, MIN dan MAX membantu menemukan harga paling rendah dan paling tinggi.",
    syntax: "SELECT MIN(kolom), MAX(kolom)\nFROM nama_tabel;",
    example: "SELECT MIN(harga) AS termurah, MAX(harga) AS termahal\nFROM produk;",
    exampleColumns: ["termurah", "termahal"],
    exampleRows: [{ termurah: 150000, termahal: 1800000 }],
    commonMistakes: [
      "Mengira MIN dan MAX selalu membutuhkan GROUP BY.",
      "Tidak memberi alias.",
      "Memakai kolom yang tidak sesuai konteks."
    ]
  },
  {
    id: "lesson-group-by",
    slug: "group-by",
    challengeId: "challenge-group-by",
    level: "Level 2 - Agregasi Data",
    title: "GROUP BY: Mengelompokkan Data",
    shortTitle: "GROUP BY",
    description: "Buat ringkasan per kota, kategori, atau kelompok lain.",
    difficulty: "Menengah",
    topic: "GROUP BY",
    concept: "GROUP BY mengelompokkan baris sebelum dihitung dengan fungsi agregasi.",
    beginnerExplanation:
      "Kalau kamu ingin tahu jumlah pelanggan per kota, GROUP BY mengumpulkan pelanggan berdasarkan kota lalu COUNT menghitung tiap kelompok.",
    syntax: "SELECT kolom_grup, COUNT(*)\nFROM nama_tabel\nGROUP BY kolom_grup;",
    example: "SELECT kota, COUNT(*) AS total\nFROM pelanggan\nGROUP BY kota;",
    exampleColumns: ["kota", "total"],
    exampleRows: [
      { kota: "Jakarta", total: 2 },
      { kota: "Bandung", total: 1 }
    ],
    commonMistakes: [
      "Memilih kolom biasa tanpa memasukkannya ke GROUP BY.",
      "Lupa fungsi agregasi seperti COUNT.",
      "Mengelompokkan kolom yang tidak menjawab pertanyaan bisnis."
    ]
  },
  {
    id: "lesson-having",
    slug: "having",
    challengeId: "challenge-having",
    level: "Level 2 - Agregasi Data",
    title: "HAVING: Filter Setelah Grouping",
    shortTitle: "HAVING",
    description: "Saring hasil agregasi setelah GROUP BY.",
    difficulty: "Menengah",
    topic: "HAVING",
    concept: "HAVING memfilter hasil setelah data dikelompokkan.",
    beginnerExplanation:
      "WHERE menyaring baris sebelum dihitung. HAVING menyaring hasil hitungan, misalnya hanya kota dengan lebih dari satu pelanggan.",
    syntax: "SELECT kolom_grup, COUNT(*)\nFROM nama_tabel\nGROUP BY kolom_grup\nHAVING COUNT(*) > angka;",
    example: "SELECT kota, COUNT(*) AS total\nFROM pelanggan\nGROUP BY kota\nHAVING COUNT(*) > 1;",
    exampleColumns: ["kota", "total"],
    exampleRows: [{ kota: "Jakarta", total: 2 }],
    commonMistakes: [
      "Memakai WHERE untuk memfilter COUNT.",
      "Lupa GROUP BY sebelum HAVING.",
      "Membuat kondisi HAVING yang tidak memakai agregasi."
    ]
  },
  {
    id: "lesson-join-dasar",
    slug: "join-dasar",
    challengeId: "challenge-join-dasar",
    level: "Level 3 - Data Analyst Case",
    title: "JOIN Dasar",
    shortTitle: "JOIN Dasar",
    description: "Gabungkan data dari dua tabel yang saling terhubung.",
    difficulty: "Menengah",
    topic: "JOIN",
    concept: "JOIN menghubungkan baris dari dua tabel lewat kolom kunci.",
    beginnerExplanation:
      "Tabel pesanan menyimpan pelanggan_id. Dengan JOIN, kamu bisa melihat nama pelanggan dari tabel pelanggan untuk setiap pesanan.",
    syntax: "SELECT kolom\nFROM tabel_a\nJOIN tabel_b ON tabel_a.id = tabel_b.tabel_a_id;",
    example:
      "SELECT pelanggan.nama, pesanan.total_harga\nFROM pesanan\nJOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id;",
    exampleColumns: ["nama", "total_harga"],
    exampleRows: [
      { nama: "Andi Pratama", total_harga: 150000 },
      { nama: "Sari Lestari", total_harga: 450000 }
    ],
    commonMistakes: [
      "Menghubungkan kolom ID yang tidak cocok.",
      "Lupa menulis ON.",
      "Mengambil kolom dengan nama ambigu tanpa nama tabel."
    ]
  },
  {
    id: "lesson-case-when",
    slug: "case-when",
    challengeId: "challenge-case-when",
    level: "Level 3 - Data Analyst Case",
    title: "CASE WHEN",
    shortTitle: "CASE WHEN",
    description: "Buat kategori baru berdasarkan kondisi.",
    difficulty: "Menengah",
    topic: "CASE",
    concept: "CASE WHEN membuat label baru dari kondisi yang kamu tentukan.",
    beginnerExplanation:
      "Untuk analisis, kamu bisa mengelompokkan produk menjadi murah atau mahal berdasarkan harga.",
    syntax: "SELECT CASE WHEN kondisi THEN nilai ELSE nilai_lain END AS nama_baru\nFROM nama_tabel;",
    example:
      "SELECT nama_produk,\nCASE WHEN harga > 400000 THEN 'Premium' ELSE 'Reguler' END AS kategori_harga\nFROM produk;",
    exampleColumns: ["nama_produk", "kategori_harga"],
    exampleRows: [
      { nama_produk: "Keyboard Mechanical", kategori_harga: "Premium" },
      { nama_produk: "Mouse Wireless", kategori_harga: "Reguler" }
    ],
    commonMistakes: [
      "Lupa END.",
      "Tidak memberi alias pada kolom baru.",
      "Membuat kondisi yang saling bertabrakan."
    ]
  },
  {
    id: "lesson-analisis-penjualan",
    slug: "analisis-penjualan",
    challengeId: "challenge-analisis-penjualan",
    level: "Level 3 - Data Analyst Case",
    title: "Analisis Penjualan",
    shortTitle: "Analisis Penjualan",
    description: "Gunakan SQL untuk membaca performa transaksi.",
    difficulty: "Menengah",
    topic: "Analyst Case",
    concept: "Analisis penjualan menggabungkan agregasi dan konteks bisnis.",
    beginnerExplanation:
      "Data Analyst sering diminta menjawab pertanyaan seperti total transaksi, produk terlaris, dan penjualan per tanggal.",
    syntax: "SELECT tanggal_pesanan, SUM(total_harga)\nFROM pesanan\nGROUP BY tanggal_pesanan;",
    example:
      "SELECT tanggal_pesanan, SUM(total_harga) AS total\nFROM pesanan\nGROUP BY tanggal_pesanan;",
    exampleColumns: ["tanggal_pesanan", "total"],
    exampleRows: [
      { tanggal_pesanan: "2024-03-10", total: 150000 },
      { tanggal_pesanan: "2024-03-12", total: 450000 }
    ],
    commonMistakes: [
      "Langsung menghitung tanpa memahami pertanyaan bisnis.",
      "Tidak mengecek kolom tanggal yang digunakan.",
      "Lupa memberi nama hasil agregasi."
    ]
  },
  {
    id: "lesson-analisis-pelanggan",
    slug: "analisis-pelanggan",
    challengeId: "challenge-analisis-pelanggan",
    level: "Level 3 - Data Analyst Case",
    title: "Analisis Pelanggan",
    shortTitle: "Analisis Pelanggan",
    description: "Baca pola pelanggan dari kota dan riwayat transaksi.",
    difficulty: "Menengah",
    topic: "Analyst Case",
    concept: "Analisis pelanggan membantu memahami siapa pengguna produk.",
    beginnerExplanation:
      "Kamu bisa mulai dari pertanyaan sederhana: pelanggan berasal dari kota mana, siapa yang pernah membeli, dan berapa banyak transaksinya.",
    syntax: "SELECT kota, COUNT(*)\nFROM pelanggan\nGROUP BY kota;",
    example: "SELECT kota, COUNT(*) AS total_pelanggan\nFROM pelanggan\nGROUP BY kota;",
    exampleColumns: ["kota", "total_pelanggan"],
    exampleRows: [
      { kota: "Jakarta", total_pelanggan: 2 },
      { kota: "Bandung", total_pelanggan: 1 }
    ],
    commonMistakes: [
      "Menyimpulkan terlalu jauh dari data kecil.",
      "Tidak membedakan pelanggan dan pesanan.",
      "Mengabaikan kota dengan data sedikit."
    ]
  },
  {
    id: "lesson-produk-terlaris",
    slug: "produk-terlaris",
    challengeId: "challenge-produk-terlaris",
    level: "Level 3 - Data Analyst Case",
    title: "Produk Terlaris",
    shortTitle: "Produk Terlaris",
    description: "Temukan produk yang paling banyak dipesan.",
    difficulty: "Menengah",
    topic: "Analyst Case",
    concept: "Produk terlaris biasanya dilihat dari jumlah terjual atau total penjualan.",
    beginnerExplanation:
      "Kamu perlu menghubungkan pesanan dengan produk, lalu menghitung jumlah pesanan untuk setiap produk.",
    syntax: "SELECT produk.nama_produk, SUM(pesanan.jumlah)\nFROM pesanan\nJOIN produk ON produk.id = pesanan.produk_id\nGROUP BY produk.nama_produk;",
    example:
      "SELECT produk.nama_produk, SUM(pesanan.jumlah) AS total_terjual\nFROM pesanan\nJOIN produk ON produk.id = pesanan.produk_id\nGROUP BY produk.nama_produk;",
    exampleColumns: ["nama_produk", "total_terjual"],
    exampleRows: [
      { nama_produk: "Laptop Stand", total_terjual: 2 },
      { nama_produk: "Mouse Wireless", total_terjual: 1 }
    ],
    commonMistakes: [
      "Mengurutkan berdasarkan harga, bukan jumlah terjual.",
      "Lupa GROUP BY nama produk.",
      "Tidak menentukan metrik terlaris dengan jelas."
    ]
  }
];

export const challenges: Challenge[] = [
  {
    id: "challenge-apa-itu-sql",
    lessonId: "lesson-apa-itu-sql",
    slug: "latihan-apa-itu-sql",
    title: "Ambil Nama Pelanggan",
    description: "Mulai dengan query SQL paling sederhana.",
    story:
      "Tim data ingin memastikan kamu sudah memahami pola dasar SELECT dan FROM sebelum masuk ke latihan berikutnya.",
    task: "Tampilkan kolom nama dari tabel pelanggan.",
    topic: "SELECT",
    difficulty: "Mudah",
    table: "pelanggan",
    requiredColumns: ["nama"],
    expectedInfo: "Hasil harus berisi kolom nama dari tabel pelanggan.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Contoh pola: SELECT nama_kolom FROM nama_tabel;\n",
    hints: [
      "Mulai query dengan SELECT.",
      "Pilih kolom nama.",
      "Ambil data dari tabel pelanggan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menulis query SQL dasar dengan SELECT dan FROM."
  },
  {
    id: "challenge-select",
    lessonId: "lesson-select",
    slug: "latihan-select",
    title: "Laporan untuk Tim Marketing",
    description: "Tampilkan nama dan email pelanggan.",
    story:
      "Tim Marketing membutuhkan daftar pelanggan untuk campaign email. Mereka hanya membutuhkan nama dan email pelanggan.",
    task: "Tampilkan hanya kolom nama dan email dari tabel pelanggan.",
    topic: "SELECT",
    difficulty: "Mudah",
    table: "pelanggan",
    requiredColumns: ["nama", "email"],
    expectedInfo: "Hasil harus berisi kolom nama dan email saja.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Contoh: SELECT nama FROM pelanggan;\n",
    hints: [
      "Mulai query dengan SELECT.",
      "Pisahkan kolom nama dan email memakai koma.",
      "Ambil data dari tabel pelanggan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menampilkan nama dan email pelanggan."
  },
  {
    id: "challenge-memilih-kolom-tertentu",
    lessonId: "lesson-memilih-kolom-tertentu",
    slug: "latihan-memilih-kolom-tertentu",
    title: "Daftar Harga Produk",
    description: "Tampilkan kolom yang dibutuhkan untuk laporan harga.",
    story:
      "Tim katalog ingin membuat daftar harga sederhana tanpa membawa seluruh isi tabel produk.",
    task: "Tampilkan nama_produk dan harga dari tabel produk.",
    topic: "SELECT",
    difficulty: "Mudah",
    table: "produk",
    requiredColumns: ["nama_produk", "harga"],
    expectedInfo: "Hasil harus berisi kolom nama_produk dan harga saja.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: pilih nama_produk dan harga.\n",
    hints: [
      "Pilih hanya kolom yang diminta.",
      "Pisahkan nama_produk dan harga dengan koma.",
      "Ambil data dari tabel produk."
    ],
    successFeedback:
      "Benar! Kamu berhasil memilih kolom yang relevan untuk laporan."
  },
  {
    id: "challenge-where",
    lessonId: "lesson-where",
    slug: "latihan-where",
    title: "Cari Pelanggan dari Jakarta",
    description: "Tampilkan pelanggan yang tinggal di Jakarta.",
    story:
      "Tim operasional ingin membuat laporan pelanggan berdasarkan kota agar campaign bisa lebih relevan.",
    task: "Tampilkan nama dan kota pelanggan yang tinggal di Jakarta.",
    topic: "WHERE",
    difficulty: "Mudah",
    table: "pelanggan",
    requiredColumns: ["nama", "kota"],
    expectedInfo: "Hasil perlu memakai kondisi kota = 'Jakarta'.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan WHERE kota = 'Jakarta';\n",
    hints: [
      "Gunakan WHERE untuk menyaring baris.",
      "Teks seperti Jakarta ditulis dengan tanda kutip.",
      "Pastikan tabelnya pelanggan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menyaring pelanggan yang tinggal di Jakarta."
  },
  {
    id: "challenge-order-by",
    lessonId: "lesson-order-by",
    slug: "latihan-order-by",
    title: "Produk Termahal",
    description: "Urutkan produk berdasarkan harga tertinggi.",
    story:
      "Tim katalog ingin melihat produk paling mahal terlebih dahulu untuk mengecek strategi harga.",
    task: "Tampilkan nama_produk dan harga dari tabel produk, urutkan dari harga tertinggi.",
    topic: "ORDER BY",
    difficulty: "Mudah",
    table: "produk",
    requiredColumns: ["nama_produk", "harga"],
    expectedInfo: "Hasil perlu memakai ORDER BY harga DESC.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: ORDER BY harga DESC;\n",
    hints: [
      "Pilih kolom nama_produk dan harga.",
      "Gunakan ORDER BY untuk mengurutkan.",
      "DESC berarti dari nilai tertinggi ke terendah."
    ],
    successFeedback:
      "Benar! Produk sudah diurutkan dari harga tertinggi."
  },
  {
    id: "challenge-limit",
    lessonId: "lesson-limit",
    slug: "latihan-limit",
    title: "3 Pesanan Terbaru",
    description: "Tampilkan 3 pesanan terbaru.",
    story:
      "Customer service ingin melihat pesanan terakhir agar bisa melakukan pengecekan cepat.",
    task: "Tampilkan id dan tanggal_pesanan dari tabel pesanan, urutkan terbaru, batasi 3 baris.",
    topic: "LIMIT",
    difficulty: "Mudah",
    table: "pesanan",
    requiredColumns: ["id", "tanggal_pesanan"],
    expectedInfo: "Hasil perlu memakai ORDER BY tanggal_pesanan DESC dan LIMIT 3.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: ORDER BY tanggal_pesanan DESC LIMIT 3;\n",
    hints: [
      "Gunakan ORDER BY tanggal_pesanan DESC.",
      "Tambahkan LIMIT 3 di akhir query.",
      "Pilih kolom id dan tanggal_pesanan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menampilkan 3 pesanan terbaru."
  },
  {
    id: "challenge-distinct",
    lessonId: "lesson-distinct",
    slug: "latihan-distinct",
    title: "Daftar Kota Unik",
    description: "Tampilkan kota pelanggan tanpa duplikat.",
    story:
      "Tim marketing ingin tahu kota mana saja yang sudah ada di data pelanggan sebelum membuat segmentasi.",
    task: "Tampilkan daftar kota unik dari tabel pelanggan.",
    topic: "DISTINCT",
    difficulty: "Mudah",
    table: "pelanggan",
    requiredColumns: ["kota"],
    expectedInfo: "Hasil perlu memakai DISTINCT pada kolom kota.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan SELECT DISTINCT kota.\n",
    hints: [
      "Gunakan DISTINCT setelah SELECT.",
      "Pilih kolom kota.",
      "Ambil data dari tabel pelanggan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menampilkan daftar kota tanpa duplikat."
  },
  {
    id: "challenge-count",
    lessonId: "lesson-count",
    slug: "latihan-count",
    title: "Hitung Total Pelanggan",
    description: "Cari jumlah baris pada tabel pelanggan.",
    story:
      "Tim bisnis ingin tahu jumlah pelanggan yang tersedia di data latihan sebelum membaca detailnya.",
    task: "Hitung total pelanggan dari tabel pelanggan.",
    topic: "COUNT",
    difficulty: "Mudah",
    table: "pelanggan",
    requiredColumns: [],
    expectedInfo: "Hasil perlu memakai COUNT(*) dari tabel pelanggan.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan COUNT(*).\n",
    hints: [
      "Gunakan fungsi COUNT(*).",
      "Ambil data dari tabel pelanggan.",
      "Beri alias seperti total_pelanggan agar hasil mudah dibaca."
    ],
    successFeedback:
      "Benar! Kamu berhasil menghitung total pelanggan."
  },
  {
    id: "challenge-sum",
    lessonId: "lesson-sum",
    slug: "latihan-sum",
    title: "Total Nilai Pesanan",
    description: "Jumlahkan nilai transaksi dari tabel pesanan.",
    story:
      "Tim finance ingin melihat total nilai pesanan dari data transaksi sederhana.",
    task: "Hitung total_harga keseluruhan dari tabel pesanan.",
    topic: "SUM",
    difficulty: "Mudah",
    table: "pesanan",
    requiredColumns: [],
    expectedInfo: "Hasil perlu memakai SUM(total_harga).",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan SUM(total_harga).\n",
    hints: [
      "Gunakan fungsi SUM untuk kolom angka.",
      "Kolom yang dijumlahkan adalah total_harga.",
      "Ambil data dari tabel pesanan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menjumlahkan total nilai pesanan."
  },
  {
    id: "challenge-avg",
    lessonId: "lesson-avg",
    slug: "latihan-avg",
    title: "Rata-rata Harga Produk",
    description: "Cari harga produk rata-rata.",
    story:
      "Tim katalog ingin membaca gambaran umum harga produk tanpa mengecek satu per satu.",
    task: "Hitung rata-rata harga dari tabel produk.",
    topic: "AVG",
    difficulty: "Mudah",
    table: "produk",
    requiredColumns: [],
    expectedInfo: "Hasil perlu memakai AVG(harga).",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan AVG(harga).\n",
    hints: [
      "Gunakan fungsi AVG.",
      "Kolom yang dihitung adalah harga.",
      "Ambil data dari tabel produk."
    ],
    successFeedback:
      "Benar! Kamu berhasil menghitung rata-rata harga produk."
  },
  {
    id: "challenge-min-max",
    lessonId: "lesson-min-max",
    slug: "latihan-min-max",
    title: "Harga Termurah dan Termahal",
    description: "Cari rentang harga produk.",
    story:
      "Tim katalog ingin tahu harga paling rendah dan paling tinggi sebagai bahan evaluasi.",
    task: "Tampilkan harga termurah dan termahal dari tabel produk.",
    topic: "MIN MAX",
    difficulty: "Mudah",
    table: "produk",
    requiredColumns: [],
    expectedInfo: "Hasil perlu memakai MIN(harga) dan MAX(harga).",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan MIN(harga) dan MAX(harga).\n",
    hints: [
      "Gunakan MIN untuk nilai terkecil.",
      "Gunakan MAX untuk nilai terbesar.",
      "Keduanya membaca kolom harga dari tabel produk."
    ],
    successFeedback:
      "Benar! Kamu berhasil menemukan harga termurah dan termahal."
  },
  {
    id: "challenge-group-by",
    lessonId: "lesson-group-by",
    slug: "latihan-group-by",
    title: "Total Pelanggan per Kota",
    description: "Hitung jumlah pelanggan per kota.",
    story:
      "Tim bisnis ingin tahu kota mana yang paling banyak memiliki pelanggan sebagai gambaran awal market.",
    task: "Tampilkan kota dan jumlah pelanggan dari tabel pelanggan untuk setiap kota.",
    topic: "GROUP BY",
    difficulty: "Menengah",
    table: "pelanggan",
    requiredColumns: ["kota"],
    expectedInfo: "Hasil perlu memakai COUNT(*) dan GROUP BY kota.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan COUNT(*) dan GROUP BY kota;\n",
    hints: [
      "Pilih kolom kota.",
      "Tambahkan COUNT(*) AS total.",
      "Gunakan GROUP BY kota agar hitungan dibuat per kota."
    ],
    successFeedback:
      "Benar! Kamu berhasil membuat ringkasan jumlah pelanggan per kota."
  },
  {
    id: "challenge-having",
    lessonId: "lesson-having",
    slug: "latihan-having",
    title: "Kota dengan Banyak Pelanggan",
    description: "Saring hasil agregasi setelah GROUP BY.",
    story:
      "Tim bisnis ingin fokus pada kota yang memiliki lebih dari satu pelanggan di data latihan.",
    task: "Tampilkan kota dan jumlah pelanggan, lalu tampilkan hanya kota dengan jumlah pelanggan lebih dari 1.",
    topic: "HAVING",
    difficulty: "Menengah",
    table: "pelanggan",
    requiredColumns: ["kota"],
    expectedInfo: "Hasil perlu memakai COUNT(*), GROUP BY kota, dan HAVING COUNT(*) > 1.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: GROUP BY kota lalu HAVING COUNT(*) > 1.\n",
    hints: [
      "Gunakan GROUP BY kota terlebih dahulu.",
      "Hitung jumlah pelanggan dengan COUNT(*).",
      "Gunakan HAVING untuk menyaring hasil hitungan."
    ],
    successFeedback:
      "Benar! Kamu berhasil menyaring hasil agregasi dengan HAVING."
  },
  {
    id: "challenge-join-dasar",
    lessonId: "lesson-join-dasar",
    slug: "latihan-join-dasar",
    title: "Nama Pelanggan di Pesanan",
    description: "Gabungkan pesanan dengan data pelanggan.",
    story:
      "Customer service ingin melihat nilai pesanan bersama nama pelanggan agar laporan lebih mudah dibaca.",
    task: "Tampilkan nama pelanggan dan total_harga pesanan dengan JOIN antara pesanan dan pelanggan.",
    topic: "JOIN",
    difficulty: "Menengah",
    table: "pesanan",
    requiredColumns: ["nama", "total_harga"],
    expectedInfo: "Hasil perlu memakai JOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: JOIN pelanggan ON pelanggan.id = pesanan.pelanggan_id.\n",
    hints: [
      "Mulai dari tabel pesanan.",
      "JOIN ke tabel pelanggan.",
      "Hubungkan pelanggan.id dengan pesanan.pelanggan_id."
    ],
    successFeedback:
      "Benar! Kamu berhasil menggabungkan pesanan dengan data pelanggan."
  },
  {
    id: "challenge-case-when",
    lessonId: "lesson-case-when",
    slug: "latihan-case-when",
    title: "Kategori Harga Produk",
    description: "Buat label harga dengan CASE WHEN.",
    story:
      "Tim katalog ingin memberi label Premium atau Reguler untuk produk berdasarkan harga.",
    task: "Tampilkan nama_produk dan kategori_harga. Produk dengan harga lebih dari 400000 diberi label Premium, sisanya Reguler.",
    topic: "CASE",
    difficulty: "Menengah",
    table: "produk",
    requiredColumns: ["nama_produk"],
    expectedInfo: "Hasil perlu memakai CASE WHEN harga > 400000 THEN 'Premium' ELSE 'Reguler' END.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: gunakan CASE WHEN harga > 400000.\n",
    hints: [
      "Gunakan CASE WHEN untuk membuat kolom baru.",
      "Jangan lupa ELSE dan END.",
      "Beri alias seperti kategori_harga."
    ],
    successFeedback:
      "Benar! Kamu berhasil membuat kategori harga dengan CASE WHEN."
  },
  {
    id: "challenge-analisis-penjualan",
    lessonId: "lesson-analisis-penjualan",
    slug: "latihan-analisis-penjualan",
    title: "Ringkasan Penjualan Harian",
    description: "Buat ringkasan total penjualan per tanggal.",
    story:
      "Tim bisnis ingin melihat performa transaksi harian dari tabel pesanan.",
    task: "Tampilkan tanggal_pesanan dan total penjualan per tanggal dari tabel pesanan.",
    topic: "Analyst Case",
    difficulty: "Menengah",
    table: "pesanan",
    requiredColumns: ["tanggal_pesanan"],
    expectedInfo: "Hasil perlu memakai SUM(total_harga) dan GROUP BY tanggal_pesanan.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: kelompokkan berdasarkan tanggal_pesanan.\n",
    hints: [
      "Pilih tanggal_pesanan.",
      "Jumlahkan total_harga dengan SUM.",
      "Gunakan GROUP BY tanggal_pesanan."
    ],
    successFeedback:
      "Benar! Kamu berhasil membuat ringkasan penjualan harian."
  },
  {
    id: "challenge-analisis-pelanggan",
    lessonId: "lesson-analisis-pelanggan",
    slug: "latihan-analisis-pelanggan",
    title: "Sebaran Pelanggan per Kota",
    description: "Baca pola pelanggan berdasarkan kota.",
    story:
      "Tim marketing ingin memahami sebaran pelanggan agar rencana campaign lebih terarah.",
    task: "Tampilkan kota dan total pelanggan untuk setiap kota.",
    topic: "Analyst Case",
    difficulty: "Menengah",
    table: "pelanggan",
    requiredColumns: ["kota"],
    expectedInfo: "Hasil perlu memakai COUNT(*) dan GROUP BY kota.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: hitung pelanggan per kota.\n",
    hints: [
      "Pilih kolom kota.",
      "Gunakan COUNT(*) untuk menghitung pelanggan.",
      "Gunakan GROUP BY kota."
    ],
    successFeedback:
      "Benar! Kamu berhasil membaca sebaran pelanggan per kota."
  },
  {
    id: "challenge-produk-terlaris",
    lessonId: "lesson-produk-terlaris",
    slug: "latihan-produk-terlaris",
    title: "Produk Terlaris",
    description: "Temukan produk yang paling banyak dipesan.",
    story:
      "Tim bisnis ingin tahu produk mana yang paling sering dibeli agar stok bisa diprioritaskan.",
    task: "Gabungkan pesanan dengan produk, lalu tampilkan nama_produk dan total_terjual dari jumlah pesanan.",
    topic: "Analyst Case",
    difficulty: "Menengah",
    table: "pesanan",
    requiredColumns: ["nama_produk"],
    expectedInfo: "Hasil perlu memakai JOIN produk, SUM(jumlah), GROUP BY nama_produk, dan ORDER BY total_terjual DESC.",
    starterQuery:
      "-- Tulis query SQL kamu di sini\n-- Petunjuk: JOIN produk lalu SUM(pesanan.jumlah).\n",
    hints: [
      "JOIN pesanan dengan produk lewat produk_id.",
      "Jumlahkan pesanan.jumlah.",
      "Urutkan total_terjual dari yang terbesar."
    ],
    successFeedback:
      "Benar! Kamu berhasil menemukan produk terlaris dari data pesanan."
  }
];

export const progressTopics = [
  { topic: "SELECT", icon: BookOpen },
  { topic: "WHERE", icon: Filter },
  { topic: "ORDER BY", icon: ListOrdered },
  { topic: "LIMIT", icon: Table2 },
  { topic: "GROUP BY", icon: Database },
  { topic: "JOIN", icon: CheckCircle2 }
];

const legacyChallengeIdMap: Record<string, string> = {
  "laporan-marketing": "challenge-select",
  "pelanggan-jakarta": "challenge-where",
  "produk-termahal": "challenge-order-by",
  "pesanan-terbaru": "challenge-limit",
  "total-pelanggan-kota": "challenge-group-by"
};

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}

export function getChallengeById(idOrSlug: string) {
  const id = legacyChallengeIdMap[idOrSlug] ?? idOrSlug;
  return challenges.find(
    (challenge) => challenge.id === id || challenge.slug === idOrSlug
  );
}

export function getChallengePath(challenge: Challenge) {
  return `/challenges/${challenge.slug}`;
}

export function getNextLesson(slug: string) {
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === slug);
  return currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;
}

export function getNextChallenge(id: string) {
  const currentIndex = challenges.findIndex((challenge) => challenge.id === id);
  return currentIndex >= 0 ? challenges[currentIndex + 1] : undefined;
}

export function getRelatedChallengeForLesson(lesson: Lesson) {
  return getChallengeById(lesson.challengeId);
}

export function getRelatedLessonForChallenge(challenge: Challenge) {
  return getLessonById(challenge.lessonId);
}

export function getLessonsByLevel() {
  return lessons.reduce<Record<Lesson["level"], Lesson[]>>(
    (groups, lesson) => {
      groups[lesson.level] = [...(groups[lesson.level] ?? []), lesson];
      return groups;
    },
    {
      "Level 1 - SQL Dasar": [],
      "Level 2 - Agregasi Data": [],
      "Level 3 - Data Analyst Case": []
    }
  );
}
