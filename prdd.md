Querix
Frontend MVP PRD
Belajar SQL dari Nol, Langsung Praktik

Platform belajar SQL interaktif berbahasa Indonesia untuk calon Data Analyst.
 
1. Project Overview
Build a frontend-only web application called Querix.
Querix adalah platform belajar SQL interaktif berbahasa Indonesia yang dirancang untuk pemula, calon Data Analyst, mahasiswa, dan career switcher yang ingin belajar SQL dari nol melalui penjelasan sederhana, latihan langsung, dan contoh kasus yang dekat dengan dunia kerja.
Aplikasi ini harus terasa modern, bersih, mudah dipahami orang awam, dan tidak terlalu teknis di awal. Fokus utama MVP adalah membuat pengalaman belajar SQL yang jelas, nyaman, dan beginner-friendly.
This is a frontend-only MVP. No backend, database, authentication server, real SQL execution engine, or API integration is required in this pass. Use mock data and local state only.
2. Product Identity
Item	Value
Product Name	Querix
Tagline	Belajar SQL dari Nol, Langsung Praktik.
Subtitle	Platform belajar SQL interaktif berbahasa Indonesia untuk calon Data Analyst.

3. Goals
•	Understand basic SQL concepts in Bahasa Indonesia.
•	Practice SQL queries directly in the browser.
•	Learn through structured lessons from beginner level.
•	See database schema examples.
•	Run mock SQL queries and display sample results.
•	Submit answers and receive beginner-friendly feedback.
•	Track learning progress visually.
4. Target Users
•	Pemula yang baru belajar SQL.
•	Calon Data Analyst.
•	Mahasiswa yang ingin belajar database.
•	Career switcher ke bidang data.
•	Orang Indonesia yang lebih nyaman belajar dengan Bahasa Indonesia.
•	Pengguna yang takut coding dan butuh penjelasan sederhana.
5. Design Direction
The design should be inspired by modern learning platforms, but not copied directly from any existing site. The interface should be modern, clean, friendly, educational, and easy to understand for non-technical users.
Design Principle	Description
Clean landing page	Large hero typography, friendly layout, clear call-to-action buttons.
Beginner-friendly	Do not make the UI too technical or intimidating.
Portfolio-ready	Professional enough to show as a polished frontend MVP.

6. Visual Style
6.1 Color Palette
Purpose	Color
Background	#F8F7F3 or soft warm white
Primary	#24126A deep indigo/purple
Accent	#2563EB blue/cyan
Secondary Accent	#FBBF24 soft yellow
Text Primary	#111827
Text Secondary	#6B7280
Border	#E5E7EB
Success	#16A34A
Warning	#F59E0B
Error	#DC2626

6.2 UI Style
•	Rounded cards
•	Soft shadows
•	Clean spacing
•	Large readable text
•	Friendly icons
•	Minimal navigation
•	Clear hierarchy
•	Avoid clutter
7. Tech Stack
Layer	Technology
Framework	Next.js App Router
Language	TypeScript
Styling	Tailwind CSS
UI Components	shadcn/ui
Icons	lucide-react
SQL Editor	Monaco Editor
Charts	Recharts if useful

Do not implement backend in this MVP. No database, API routes, PostgreSQL, Drizzle, Better Auth, or server actions. Use only frontend mock data.
8. Routes / Pages
Route	Purpose
/	Landing page
/dashboard	Learning dashboard
/learn	List of SQL lessons
/learn/[slug]	Lesson detail page
/challenges	List of SQL practice challenges
/challenges/[id]	SQL challenge page with editor
/playground	Free SQL playground page

9. Navigation
Use simple navigation only.
Area	Items
Desktop navbar	Logo: Querix, Belajar, Tantangan, Playground, Dashboard, Mulai Gratis button
Mobile navbar	Hamburger menu with simple slide/dropdown navigation

Do not add unnecessary menus like Store, Blog, FAQ, Premium, etc. Keep the MVP focused.
10. Landing Page Requirements
10.1 Hero Section
Element	Content
Badge	Platform Belajar SQL Interaktif Bahasa Indonesia
Title	Belajar SQL dari Nol, Langsung Praktik
Subtitle	Querix membantu kamu memahami SQL dengan penjelasan sederhana, latihan interaktif, dan contoh kasus Data Analyst dunia nyata.
Primary CTA	Mulai Belajar Gratis
Secondary CTA	Lihat Tantangan SQL

10.2 Why Querix Section
Card	Description
Bahasa Indonesia	Materi dijelaskan dengan bahasa sederhana dan mudah dipahami.
Langsung Praktik	Tulis query SQL langsung di browser dan lihat hasilnya.
Beginner Friendly	Mulai dari SELECT, WHERE, GROUP BY, sampai JOIN.
Real World Case	Latihan menggunakan contoh kasus yang sering ditemui Data Analyst.

10.3 Learning Path Preview
1.	SQL Dasar
2.	Filter Data
3.	Sorting & Limit
4.	Aggregation
5.	Grouping
6.	Join Tables
7.	Analyst Case
10.4 Interactive Preview
SELECT nama, kota
FROM pelanggan
WHERE kota = 'Jakarta';
Below the editor card, show a mock result table.
10.5 Final CTA
Element	Content
Text	Siap mulai ngulik data?
Button	Mulai Sekarang

11. Dashboard Page
The dashboard is the home for logged-in-like user experience, but no real auth is needed. Use mock user data.
KPI	Example Value
Materi selesai	4 / 12 materi
Tantangan selesai	8 tantangan selesai
Progress belajar	32% progress
Streak latihan	3 hari streak

Include a Continue Learning Card: Lanjutkan: WHERE untuk Filter Data, with button Lanjut Belajar.
Add a simple progress chart by topic: SELECT, WHERE, ORDER BY, LIMIT, GROUP BY, JOIN.
Show three recommended beginner challenges.
12. Learn Page
Show lesson list grouped by level.
Level	Lessons
Level 1 - SQL Dasar	Apa itu SQL?, SELECT, Memilih Kolom Tertentu, WHERE, ORDER BY, LIMIT, DISTINCT
Level 2 - Agregasi Data	COUNT, SUM, AVG, MIN & MAX, GROUP BY, HAVING
Level 3 - Data Analyst Case	JOIN Dasar, CASE WHEN, Analisis Penjualan, Analisis Pelanggan, Produk Terlaris

Each lesson card should show title, short description, difficulty badge, and progress status: Belum mulai, Sedang dipelajari, Selesai.
13. Lesson Detail Page
Example route: /learn/select
Section	Content
Lesson Header	SELECT: Memilih Data dari Tabel
Description	SELECT digunakan untuk mengambil kolom tertentu dari sebuah tabel.
Beginner Explanation	Bayangkan kamu punya tabel pelanggan. Jika kamu hanya ingin melihat nama dan email pelanggan, kamu bisa menggunakan SELECT untuk memilih kolom tersebut.

SELECT nama_kolom
FROM nama_tabel;
SELECT nama, email
FROM pelanggan;
nama	email
Andi	andi@email.com
Sari	sari@email.com

Common Mistakes: lupa menulis FROM, salah mengetik nama kolom, menggunakan SELECT * padahal hanya butuh beberapa kolom.
Practice button: Latihan Sekarang.
14. Challenges Page
Challenge	Description	Topic	Difficulty
Laporan untuk Tim Marketing	Tampilkan nama dan email pelanggan.	SELECT	Mudah
Cari Pelanggan dari Jakarta	Tampilkan pelanggan yang tinggal di Jakarta.	WHERE	Mudah
Produk Termahal	Urutkan produk berdasarkan harga tertinggi.	ORDER BY	Mudah
5 Pesanan Terbaru	Tampilkan 5 pesanan terbaru.	LIMIT	Mudah
Total Pesanan per Kota	Hitung jumlah pelanggan per kota.	GROUP BY	Menengah

15. Challenge Detail Page
This is the most important page. Use a two-column layout on desktop.
Left Side	Right Side
Challenge description, schema database, expected result info, hints	SQL editor, run button, submit button, result table, feedback panel

15.1 Challenge Example
Field	Content
Title	Laporan untuk Tim Marketing
Story	Tim Marketing membutuhkan daftar pelanggan untuk campaign email. Mereka hanya membutuhkan nama dan email pelanggan.
Task	Tampilkan hanya kolom nama dan email dari tabel pelanggan.
Schema	Table: pelanggan; columns: id, nama, email, kota, tanggal_daftar
Expected Result	Must include only columns nama and email.

-- Tulis query SQL kamu di sini
-- Contoh: SELECT nama FROM pelanggan;
Buttons: Jalankan Query, Submit Jawaban, Reset.
Because this is frontend-only, do not execute real SQL. Create a mock validator based on keywords and required columns.
State	Feedback
Success	Benar! Kamu berhasil menampilkan nama dan email pelanggan.
Error	Belum tepat. Pastikan kamu memilih kolom nama dan email dari tabel pelanggan.

16. Playground Page
The playground is a free practice area with SQL editor, schema explorer, run query button, mock result table, and sample queries list.
SELECT * FROM pelanggan;
SELECT nama, kota FROM pelanggan;
SELECT kategori, COUNT(*) FROM produk GROUP BY kategori;
Show note: Playground ini menggunakan data latihan, bukan database asli.
17. Mock Data
17.1 pelanggan
id	nama	email	kota	tanggal_daftar
1	Andi Pratama	andi@email.com	Jakarta	2024-01-12
2	Sari Lestari	sari@email.com	Bandung	2024-01-18
3	Budi Santoso	budi@email.com	Jakarta	2024-02-01
4	Rina Wijaya	rina@email.com	Surabaya	2024-02-10
5	Dimas Putra	dimas@email.com	Medan	2024-03-05

17.2 produk
id	nama_produk	kategori	harga	stok
1	Keyboard Mechanical	Aksesoris	450000	25
2	Mouse Wireless	Aksesoris	150000	40
3	Monitor 24 inch	Elektronik	1800000	12
4	Laptop Stand	Aksesoris	220000	30
5	Webcam HD	Elektronik	350000	18

17.3 pesanan
id	pelanggan_id	produk_id	jumlah	total_harga	tanggal_pesanan
1	1	2	1	150000	2024-03-10
2	2	1	1	450000	2024-03-12
3	3	3	1	1800000	2024-03-15
4	1	4	2	440000	2024-03-18
5	4	5	1	350000	2024-03-20

18. Frontend State
Use frontend-only state and store progress in localStorage.
State Key	Purpose
completedLessons	Completed lesson slugs
completedChallenges	Completed challenge IDs
lastOpenedLesson	Continue learning state
streakCount	Mock learning streak

{
  name: "Kgs M Luthfi",
  level: "Beginner SQL Learner"
}
19. Components
•	AppNavbar
•	MobileNav
•	HeroSection
•	FeatureCard
•	LessonCard
•	ChallengeCard
•	SqlEditor
•	SchemaExplorer
•	ResultTable
•	FeedbackAlert
•	ProgressCard
•	KpiCard
•	DifficultyBadge
20. UX Requirements
The app must be beginner-friendly and fully in Bahasa Indonesia.
•	Jalankan Query
•	Submit Jawaban
•	Lihat Hasil
•	Coba Lagi
•	Benar
•	Belum Tepat
•	Petunjuk
•	Skema Database
•	Hasil Query
•	Materi
•	Tantangan
Avoid overly technical explanations. Every lesson should explain what the SQL concept does, when to use it, a simple example, and common mistakes.
21. Mock Validation Rules
For frontend-only MVP, implement basic mock validation.
Challenge 1 Correct If Query Includes	Incorrect If
SELECT, nama, email, FROM, pelanggan	Missing nama, missing email, missing pelanggan, or uses only SELECT *

Example feedback: Hampir benar. Kamu sudah memilih tabel pelanggan, tapi belum memilih kolom email.
22. Accessibility and Responsive Behavior
•	Readable contrast
•	Keyboard-friendly buttons
•	Clear focus states
•	Large clickable targets
•	Responsive layout
•	Mobile usability
Device	Behavior
Desktop	Two-column challenge layout, navbar visible
Tablet	Stacked layout if needed
Mobile	Editor below challenge description, navbar collapses, cards single column

23. Out of Scope for Frontend MVP
•	Real backend
•	Real database
•	Real SQL execution
•	Real user accounts
•	Payment
•	Premium
•	Leaderboard
•	AI tutor
•	Admin dashboard
•	Multi-user system
24. Future Improvements
•	Real authentication with Better Auth
•	PostgreSQL/Neon database
•	Drizzle ORM
•	Real SQL execution sandbox
•	User progress saved to database
•	AI SQL tutor
•	Hint system
•	Leaderboard
•	Real-world Data Analyst case packs
•	E-commerce analytics cases
•	Marketing analytics cases
•	Finance analytics cases
•	Interview preparation mode
25. Success Criteria
•	Landing page looks modern and beginner-friendly.
•	Users can navigate to lessons and challenges.
•	SQL editor is usable.
•	Mock query run displays results.
•	Submit answer gives feedback.
•	Progress is visually displayed.
•	UI is fully in Bahasa Indonesia.
•	App is responsive and polished.
•	No backend is required.
•	npm run lint and npm run build pass.
26. Implementation Notes for Codex
Create this as a fresh Next.js frontend-only project.
Use	Do Not Use
Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, Monaco Editor, Recharts if useful	Backend routes, database schemas, Drizzle setup, Better Auth, PostgreSQL integration

Focus on UI, user experience, mock data, mock query results, and beginner-friendly Indonesian content. Make the app polished enough for a portfolio demo.
27. Prompt for Codex
Create the frontend-only MVP based on prd.md. Use Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, Monaco Editor, and mock data only. Do not implement backend yet.
