

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


