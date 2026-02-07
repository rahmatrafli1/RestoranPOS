# RestoranPOS - Sistem Point of Sale untuk Restoran

Aplikasi Point of Sale (POS) untuk restoran yang dibangun menggunakan Laravel sebagai backend API dan ReactJS sebagai frontend interface.

## 🚀 Teknologi yang Digunakan

### Backend
- **Laravel 12** - PHP Framework untuk REST API
- **MySQL** - Database
- **Laravel Sanctum** - API Authentication

### Frontend
- **ReactJS 18+** - JavaScript Library untuk UI
- **Vite** - Build Tool
- **React Router** - Routing
- **Axios** - HTTP Client
- **TailwindCSS** - CSS Framework

## 📋 Fitur Utama

- ✅ Manajemen Menu & Kategori
- ✅ Manajemen Meja
- ✅ Proses Transaksi/Order
- ✅ Manajemen Pembayaran
- ✅ Laporan Penjualan
- ✅ Manajemen Pengguna & Role
- ✅ Dashboard Analitik
- ✅ Cetak Struk

## 🛠️ Instalasi

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- NPM atau Yarn
- MySQL 8.0+

### Backend Setup (Laravel)

```bash
# Clone repository
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di .env
# DB_DATABASE=restoranpos
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migration & seeder
php artisan migrate --seed

# Start development server
php artisan serve
```

### Frontend Setup (ReactJS)

```bash
# Pindah ke direktori frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Konfigurasi API endpoint di .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## 📁 Struktur Proyek

```
RestoranPOS/
├── backend/              # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/            # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
└── README.md
```

## 🔐 Default Login

- **Admin**
  - Email: `admin@restoranpos.com`
  - Password: `password`

- **Kasir**
  - Email: `kasir@restoranpos.com`
  - Password: `password`

## 📱 Endpoint API Utama

```
POST   /api/login           - Login
POST   /api/logout          - Logout
GET    /api/menu            - Daftar Menu
GET    /api/categories      - Daftar Kategori
GET    /api/tables          - Daftar Meja
POST   /api/orders          - Buat Order
GET    /api/orders/{id}     - Detail Order
POST   /api/payments        - Proses Pembayaran
GET    /api/reports         - Laporan Penjualan
```

## 🧪 Testing

```bash
# Backend testing
cd backend
php artisan test

# Frontend testing
cd frontend
npm run test
```

## 📦 Build untuk Production

```bash
# Build frontend
cd frontend
npm run build

# Optimize Laravel
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🤝 Kontribusi

Silakan buat pull request atau laporkan issue jika menemukan bug.

## 📄 Lisensi

[MIT License](LICENSE)

## 👨‍💻 Developer

- Rahmat
- Email: rahmat@example.com

## 📞 Support

Untuk pertanyaan atau bantuan, silakan hubungi tim development.

---

**RestoranPOS** - Solusi Modern untuk Manajemen Restoran Anda
