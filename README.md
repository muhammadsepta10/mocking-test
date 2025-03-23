# Project Name

## 📌 **Deskripsi Proyek**

Proyek ini adalah contoh implementasi **NestJS** dengan TypeScript yang menggunakan **Axios** untuk mengambil data dari mock API [JSONPlaceholder](https://jsonplaceholder.typicode.com). Data yang diperoleh disimpan ke database menggunakan **TypeORM** dan dilengkapi dengan mekanisme **caching** untuk meningkatkan performa aplikasi.

## 🛠️ **Tech Stack**

- **Framework:** NestJS
- **Database:** PostgreSQL (NeonDB)
- **Log Management:** MongoDB (MongoDB Atlas)
- **Cache:** Redis (Upstash Redis)
- **Environment Management:** Doppler

## ✨ **Fitur Utama**

✅ CRUD data dari API JSONPlaceholder (GET, POST, PUT, PATCH, DELETE)  
✅ Penyimpanan data ke database menggunakan TypeORM  
✅ Implementasi caching dengan Cache Manager  
✅ Kode yang bersih dan menerapkan prinsip SOLID  
✅ Arsitektur modular dengan Dependency Injection

## 🚀 **Cara Install**

### 1. Clone Repository

```sh
git clone https://github.com/muhammadsepta10/mocking-test.git
cd mocking-test
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` atau sesuaikan dengan kebutuhan:

```sh
DOPPLER_TOKEN=dp.st.dev_moch.GODGmIh3SEMzFKBqAuJDOyTJuZ8hCFgv8jefLlYNsD9
APP_PORT=3000
NODE_ENV=development
```

Gunakan **Doppler** untuk mengelola variabel lingkungan. Pastikan Anda memiliki akses, lalu sesuaikan nama proyek dan konfigurasi di `src/common/config/doppler/config.service.ts` atau biarkan default:

```typescript
const res = (await doppler.secrets.download(
  '<nama_project_anda>',
  '<nama_config_anda>',
  {
    format: 'json',
  },
)) as DoplerDTO;
this.doppler = res;
```

Variabel yang perlu disetel di Doppler:

```sh
BASE_URL=URL domain API
PROJECT_DB_URL=URL koneksi PostgreSQL
MOCK_API_URL=URL API mock yang digunakan
LOG_DB_URL=URL koneksi MongoDB
CACHE_DB_URL=URL koneksi Redis
```

### 4. Jalankan Aplikasi

```sh
npm run start:prod
```

Aplikasi sekarang berjalan di `http://localhost:3000`. Pastikan semua layanan yang diperlukan telah berjalan sebelum memulai aplikasi.
