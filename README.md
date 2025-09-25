

# Industrix Todo App

Ini project Todo app yang aku coba bikin pakai React, Node.js, TypeScript, sama PostgreSQL. Tujuannya buat belajar full-stack development, jadi kemungkinan masih ada kekurangan nya.

 Fitur yang udah ada

Bisa CRUD (tambah, lihat, edit, hapus) todo
Ada sistem kategori buat ngelompokkin todo
Bisa kasih priority (Low, Medium, High)
Ada statistik sederhana (jumlah todo selesai/belum)
Search & filter biar gampang nyari todo
Responsive design (pakai Ant Design)
Backend nyambung ke PostgreSQL database

 Tech Stack

Backend

Node.js + TypeScript
Express.js
Sequelize ORM
PostgreSQL
Middleware validasi simple

Frontend
React (Vite + TypeScript)
Ant Design (komponen UI)
Axios buat komunikasi ke API

Cara Jalanin Project
Syarat

* Node.js 
* PostgreSQL sudah terinstall
* npm 

Backend

1. Masuk ke folder backend:

   bash
   cd backend
   
2. Install dependency:

   bash
   npm install
   
3. Bikin file `.env` isi seperti ini:

   env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=industrix_todo
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3001
   
4. Jalanin server backend:

   bash
   npm run dev
   

   → Backend jalan di `http://localhost:3001`

Frontend

1. Masuk ke folder frontend:

   bash
   cd frontend
   
2. Install dependency:

   bash
   npm install
   
3. Jalanin frontend:

   bash
   npm run dev
   

   → Frontend jalan di `http://localhost:5173`

Struktur Database

tabel Categories

* id
* name (unik, wajib)
* color
* description (optional)
* created\_at, updated\_at

Tabel Todos

* id
* title (wajib)
* description (optional)
* completed (boolean, default false)
* category\_id (foreign key ke Categories)
* priority (low, medium, high)
* due\_date (optional)
* created\_at, updated\_at

API Utama

Todos

 GET /api/todos → ambil semua todo (support filter & pagination)
 POST /api/todos → tambah todo baru
 PUT /api/todos/:id → update todo
 DELETE /api/todos/:id → hapus todo
 GET /api/todos/stats → statistik todo

Categories

GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id

Testing

Backend ada beberapa unit test pake Jest + Supertest. Bisa dijalanin dengan:

bash
cd backend
npm test


Catatan

 Di mode development, database otomatis sync.
 Ada hot reload untuk frontend & backend.
 Masih banyak hal yang bisa diperbaiki, terutama error handling sama struktur kode.





Status: Sudah jalan, tapi masih versi belajar (bisa dipakai, tapi belum se-perfect production)



Database & Technical Questions (Q&A)
Database Design

What database tables did you create and why?
Tabel yang dibuat adalah categories untuk menyimpan kategori dan todos untuk menyimpan data todo dengan relasi ke kategori. Relasinya one-to-many agar lebih sederhana dan sesuai kebutuhan aplikasi todo.

How did you handle pagination and filtering in the database?
Pagination diatur menggunakan LIMIT dan OFFSET. Filtering dan sorting menggunakan WHERE serta ORDER BY. Index ditambahkan pada kolom completed, priority, dan category_id untuk mempercepat query.

Technical Decisions

How did you implement responsive design?
Responsive design diterapkan dengan breakpoints bawaan Ant Design (xs–xl). Pada layar kecil digunakan Drawer, sedangkan pada layar besar digunakan Grid dan Layout.

How did you structure your React components?
Struktur komponen dibuat sederhana (TodoList, TodoForm, FilterDrawer, dan lain-lain). State dikelola dengan Context API, termasuk filter dan pagination.

What backend architecture did you choose and why?
Backend menggunakan Express dengan pola MVC (routes, controllers, models). Error handling ditangani melalui middleware global.

How did you handle data validation?
Data divalidasi di frontend menggunakan AntD Form untuk pengalaman pengguna, dan di backend menggunakan express-validator untuk keamanan.

Testing & Quality

What did you choose to unit test and why?
Unit test dilakukan pada endpoint utama (todos, categories) menggunakan Jest dan Supertest. Edge case yang diuji meliputi input kosong, duplikat nama kategori, dan id yang tidak ditemukan.

If you had more time, what would you improve or add?
Perbaikan yang direncanakan mencakup penambahan authentication agar mendukung multi-user, Membuat Delete menjadi soft delete, pembuatan custom hooks di frontend, serta peningkatan UI dengan drag-and-drop dan dark mode.
