# Struktur Aplikasi Laporan Keuangan Keluarga

## Struktur Database yang Direkomendasikan

### 1. Model Database

```prisma
// Kategori Transaksi
model Category {
  id          String       @id @default(cuid())
  name        String       @unique
  type        FlowType     // INCOME atau EXPENSE
  transactions Transaction[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

// Tipe Arus Kas
enum FlowType {
  INCOME
  EXPENSE
}

// Transaksi
model Transaction {
  id          String    @id @default(cuid())
  date        DateTime
  amount      Float
  description String
  type        FlowType
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// Budget Bulanan
model Budget {
  id          String    @id @default(cuid())
  month       Int
  year        Int
  amount      Float
  category    Category  @relation(fields: [categoryId], references: [id])
  categoryId  String
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([month, year, categoryId, userId])
}

// Rekening/Akun
model Account {
  id          String    @id @default(cuid())
  name        String
  type        AccountType
  balance     Float
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum AccountType {
  CASH
  BANK
  E_WALLET
  INVESTMENT
}
```

### 2. Alasan Pemisahan Model

1. **Single Transaction Table**
   - Menggunakan satu tabel transaksi dengan field `type` lebih direkomendasikan karena:
     - Memudahkan query untuk laporan gabungan
     - Konsistensi dalam struktur data
     - Lebih mudah maintenance
     - Memungkinkan fitur transfer antar akun

2. **Kategori Terpisah**
   - Kategori dipisah untuk:
     - Manajemen kategori yang lebih fleksibel
     - Memungkinkan kategori berbeda untuk pemasukan dan pengeluaran
     - Analisis berdasarkan kategori lebih mudah

3. **Budget Terpisah**
   - Budget dipisah untuk:
     - Perencanaan keuangan per kategori
     - Tracking realisasi vs budget
     - Analisis pengeluaran per kategori

4. **Account/Rekening Terpisah**
   - Rekening dipisah untuk:
     - Tracking saldo per rekening
     - Memungkinkan transfer antar rekening
     - Analisis distribusi aset

## Fitur yang Dimungkinkan

### 1. Transaksi
- Input pemasukan dan pengeluaran
- Kategorisasi transaksi
- Attachment bukti transaksi
- Recurring transaction
- Transfer antar rekening

### 2. Laporan
- Laporan arus kas
- Analisis per kategori
- Tren pengeluaran
- Budget vs Aktual
- Saldo per rekening
- Grafik dan visualisasi

### 3. Budget
- Setting budget per kategori
- Notifikasi jika mendekati/melebihi budget
- Analisis realisasi budget
- Rekomendasi budget berdasarkan histori

### 4. Dashboard
- Ringkasan saldo semua rekening
- Transaksi terbaru
- Status budget
- Grafik tren pemasukan/pengeluaran
- Quick actions

## Contoh Query untuk Laporan

### 1. Laporan Arus Kas
```typescript
// Arus kas bulanan
const cashFlow = await prisma.transaction.groupBy({
  by: ['type'],
  where: {
    userId,
    date: {
      gte: startDate,
      lte: endDate
    }
  },
  _sum: {
    amount: true
  }
})
```

### 2. Analisis per Kategori
```typescript
// Pengeluaran per kategori
const expensesByCategory = await prisma.transaction.groupBy({
  by: ['categoryId'],
  where: {
    userId,
    type: 'EXPENSE',
    date: {
      gte: startDate,
      lte: endDate
    }
  },
  _sum: {
    amount: true
  },
  include: {
    category: true
  }
})
```

### 3. Budget vs Aktual
```typescript
// Perbandingan budget vs aktual
const comparison = await prisma.$queryRaw`
  SELECT 
    c.name,
    b.amount as budget,
    COALESCE(SUM(t.amount), 0) as actual
  FROM Budget b
  LEFT JOIN Transaction t ON 
    b.categoryId = t.categoryId AND
    MONTH(t.date) = b.month AND
    YEAR(t.date) = b.year
  JOIN Category c ON b.categoryId = c.id
  WHERE b.userId = ${userId}
  GROUP BY c.name, b.amount
`
```

## Best Practices

### 1. Validasi
- Validasi tipe transaksi
- Validasi jumlah tidak negatif
- Validasi tanggal tidak di masa depan
- Validasi kategori sesuai tipe transaksi

### 2. Keamanan
- Validasi akses per user
- Enkripsi data sensitif
- Logging untuk audit trail
- Backup data reguler

### 3. Performa
- Indeks untuk query umum
- Caching untuk laporan
- Pagination untuk data besar
- Optimasi query

### 4. UX
- Real-time update saldo
- Autocomplete untuk input
- Validasi form yang informatif
- Loading state yang jelas
- Responsive design

## Kesimpulan

Struktur dengan satu tabel transaksi lebih direkomendasikan karena:
1. Lebih mudah dalam maintenance
2. Query lebih sederhana
3. Konsistensi data lebih terjaga
4. Memungkinkan fitur yang lebih kompleks
5. Analisis data lebih mudah

Namun perlu diperhatikan:
1. Indexing yang tepat
2. Validasi yang ketat
3. Access control yang baik
4. Backup strategy yang solid
