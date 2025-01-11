# Database Documentation

## English Version

### About Prisma
Prisma is a next-generation ORM (Object-Relational Mapping) that makes database access easy and type-safe. It consists of three main parts:
1. Prisma Client - Auto-generated and type-safe database client
2. Prisma Migrate - Migration system to evolve your database schema
3. Prisma Studio - GUI to view and edit data in your database

### Prisma Studio
Prisma Studio is a visual database browser that allows you to:
- View and edit database records
- Explore relationships between tables
- Perform CRUD operations
- Manage database content in a user-friendly interface

### Database Structure

The database uses PostgreSQL with the following schema:

#### Models

1. **User**
   - id: String (Primary Key)
   - email: String (Unique)
   - name: String (Optional)
   - items: Item[] (Relation)
   - createdAt: DateTime
   - updatedAt: DateTime

2. **Item**
   - id: String (Primary Key)
   - name: String
   - status: Enum (Active, Pending, Inactive)
   - amount: Float
   - userId: String (Foreign Key to User)
   - createdAt: DateTime
   - updatedAt: DateTime

### Setup Instructions

1. Ensure PostgreSQL is installed and running
2. Create `.env` file with database credentials:
   ```env
   DATABASE_URL="postgresql://andix:85101426@localhost:5432/databaseku?schema=public"
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### Accessing the Database

1. **Prisma Studio** - GUI for database management:
   ```bash
   npx prisma studio
   ```
   Access at: http://localhost:5555

2. **Prisma Client** - Use in your application code:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   ```

### Maintenance

- To update schema:
  1. Modify `prisma/schema.prisma`
  2. Run migration:
     ```bash
     npx prisma migrate dev --name [migration_name]
     ```

- To reset database:
  ```bash
  npx prisma migrate reset
  ```

### Troubleshooting

- Ensure PostgreSQL service is running
- Verify database credentials in `.env`
- Check Prisma logs for errors

---

## Versi Bahasa Indonesia

### Tentang Prisma
Prisma adalah ORM (Object-Relational Mapping) generasi terbaru yang memudahkan akses database dengan type-safety. Terdiri dari tiga bagian utama:
1. Prisma Client - Client database yang di-generate otomatis dan type-safe
2. Prisma Migrate - Sistem migrasi untuk mengembangkan skema database
3. Prisma Studio - GUI untuk melihat dan mengedit data di database

### Prisma Studio
Prisma Studio adalah browser database visual yang memungkinkan Anda untuk:
- Melihat dan mengedit record database
- Menjelajahi relasi antar tabel
- Melakukan operasi CRUD
- Mengelola konten database dengan antarmuka yang user-friendly

### Struktur Database

Database menggunakan PostgreSQL dengan skema berikut:

#### Model

1. **User**
   - id: String (Primary Key)
   - email: String (Unique)
   - name: String (Opsional)
   - items: Item[] (Relasi)
   - createdAt: DateTime
   - updatedAt: DateTime

2. **Item**
   - id: String (Primary Key)
   - name: String
   - status: Enum (Active, Pending, Inactive)
   - amount: Float
   - userId: String (Foreign Key ke User)
   - createdAt: DateTime
   - updatedAt: DateTime

### Instruksi Setup

1. Pastikan PostgreSQL terinstall dan berjalan
2. Buat file `.env` dengan kredensial database:
   ```env
   DATABASE_URL="postgresql://andix:85101426@localhost:5432/databaseku?schema=public"
   ```
3. Jalankan migrasi database:
   ```bash
   npx prisma migrate dev --name init
   ```

### Mengakses Database

1. **Prisma Studio** - GUI untuk manajemen database:
   ```bash
   npx prisma studio
   ```
   Akses di: http://localhost:5555

2. **Prisma Client** - Gunakan di kode aplikasi:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   const prisma = new PrismaClient()
   ```

### Maintenance

- Untuk memperbarui skema:
  1. Modifikasi `prisma/schema.prisma`
  2. Jalankan migrasi:
     ```bash
     npx prisma migrate dev --name [nama_migrasi]
     ```

- Untuk mereset database:
  ```bash
  npx prisma migrate reset
  ```

### Troubleshooting

- Pastikan service PostgreSQL berjalan
- Verifikasi kredensial database di `.env`
- Periksa log Prisma untuk error
