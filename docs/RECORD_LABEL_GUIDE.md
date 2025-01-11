# Panduan Penambahan Fitur Record Label

Dokumen ini menjelaskan langkah-langkah untuk menambahkan fitur Record Label pada aplikasi Family Finance.

## Daftar Isi
1. [Persiapan Database](#1-persiapan-database)
2. [Membuat API Endpoint](#2-membuat-api-endpoint)
3. [Membuat Komponen UI](#3-membuat-komponen-ui)
4. [Integrasi dengan Item](#4-integrasi-dengan-item)
5. [Pengujian](#5-pengujian)

## 1. Persiapan Database

### 1.1. Update Schema Prisma
Tambahkan model RecordLabel di `prisma/schema.prisma`:

```prisma
model RecordLabel {
  id        String   @id @default(cuid())
  name      String   @unique
  items     Item[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Update model Item
model Item {
  id            String      @id @default(cuid())
  name          String
  status        Status
  amount        Float
  user          User        @relation(fields: [userId], references: [id])
  userId        String
  recordLabel   RecordLabel? @relation(fields: [recordLabelId], references: [id])
  recordLabelId String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

### 1.2. Buat dan Jalankan Migrasi
```bash
npx prisma migrate dev --name add_record_label
```

### 1.3. Update Seed Data (opsional)
Update `prisma/seed.ts` untuk menambahkan data record label:

```typescript
const recordLabels = [
  { name: 'Pribadi' },
  { name: 'Bisnis' },
  { name: 'Investasi' }
]

// Tambahkan di fungsi main():
for (const label of recordLabels) {
  await prisma.recordLabel.create({
    data: label
  })
}
```

## 2. Membuat API Endpoint

### 2.1. Buat Route Handler
Buat file `app/api/record-labels/route.ts`:

```typescript
// GET - Mengambil semua record label
export async function GET() {
  try {
    const labels = await prisma.recordLabel.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(labels)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch record labels' },
      { status: 500 }
    )
  }
}

// POST - Membuat record label baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const label = await prisma.recordLabel.create({
      data: { name: body.name }
    })
    return NextResponse.json(label)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create record label' },
      { status: 500 }
    )
  }
}
```

### 2.2. Buat Route Handler untuk Operasi Individual
Buat file `app/api/record-labels/[id]/route.ts` untuk PUT dan DELETE.

## 3. Membuat Komponen UI

### 3.1. Form Tambah Record Label
Buat komponen `components/add-record-label-form.tsx`:

```typescript
interface AddRecordLabelFormProps {
  onSubmit: (values: { name: string }) => Promise<void>
}

// Gunakan komponen Form dari shadcn/ui
// Tambahkan validasi dengan zod
// Tambahkan toast notifications
```

### 3.2. Tabel Record Label
Buat komponen `components/record-label-table.tsx`:

```typescript
interface RecordLabel {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

// Gunakan DataTable yang sudah ada
// Tambahkan kolom actions untuk edit dan delete
```

### 3.3. Dialog Edit Record Label
Buat komponen `components/edit-record-label-dialog.tsx`:

```typescript
interface EditRecordLabelDialogProps {
  label: RecordLabel
  onLabelUpdated: (updatedLabel: RecordLabel) => void
}

// Gunakan komponen Dialog dari shadcn/ui
// Tambahkan form edit
// Tambahkan toast notifications
```

## 4. Integrasi dengan Item

### 4.1. Update Form Tambah Item
Modifikasi `components/add-item-form.tsx`:

```typescript
// Tambahkan field recordLabelId
// Tambahkan dropdown untuk memilih record label
// Update tipe data dan validasi
```

### 4.2. Update Form Edit Item
Modifikasi `components/edit-item-dialog.tsx`:

```typescript
// Tambahkan field recordLabelId
// Tambahkan dropdown untuk memilih record label
// Update tipe data dan validasi
```

### 4.3. Update Tabel Item
Modifikasi `components/data-table.tsx`:

```typescript
// Tambahkan kolom Record Label
// Update render function untuk menampilkan nama record label
```

## 5. Pengujian

### 5.1. Pengujian Database
1. Jalankan migrasi
2. Jalankan seed data
3. Periksa tabel di Prisma Studio

### 5.2. Pengujian API
1. Test endpoint GET /api/record-labels
2. Test endpoint POST /api/record-labels
3. Test endpoint PUT /api/record-labels/[id]
4. Test endpoint DELETE /api/record-labels/[id]

### 5.3. Pengujian UI
1. Test form tambah record label
2. Test tabel record label
3. Test edit record label
4. Test delete record label
5. Test integrasi dengan form item

## Catatan Penting

### Keamanan
1. Validasi input di client dan server
2. Terapkan autentikasi untuk endpoint sensitif
3. Sanitasi data sebelum menyimpan ke database

### Performa
1. Gunakan pagination untuk tabel
2. Optimasi query database
3. Implementasi caching jika diperlukan

### UX
1. Tambahkan loading state
2. Berikan feedback yang jelas (toast)
3. Konfirmasi sebelum delete
4. Validasi form yang informatif

## Troubleshooting

### Masalah Database
1. Jalankan `prisma generate` jika ada error tipe
2. Reset database dengan `prisma migrate reset`
3. Periksa relasi di Prisma Studio

### Masalah API
1. Periksa response di browser dev tools
2. Periksa log server
3. Validasi format request body

### Masalah UI
1. Periksa console errors
2. Periksa network requests
3. Periksa state management

## Referensi

1. [Prisma Documentation](https://www.prisma.io/docs)
2. [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
3. [shadcn/ui Components](https://ui.shadcn.com)
4. [Zod Validation](https://zod.dev)

## Kontribusi

Jika Anda menemukan masalah atau ingin berkontribusi:
1. Buat issue di repository
2. Submit pull request
3. Ikuti coding standards
4. Tambahkan tests
5. Update dokumentasi
