# Database Management Guide

This document explains how to manage the database using Prisma in this project.

## Setup

1. Create `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
```

2. Install dependencies:
```bash
npm install
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

## Database Commands

### Prisma Studio
To view and edit database content through a GUI:
```bash
npx prisma studio
```
This will open Prisma Studio in your browser at `http://localhost:5555`

### Migrations

#### Create a new migration
When you change the schema:
```bash
npx prisma migrate dev --name migration_name
```

#### Reset database
To reset the database and apply all migrations:
```bash
npx prisma migrate reset
```

#### Apply migrations
To apply pending migrations:
```bash
npx prisma migrate deploy
```

### Seed Data
To populate the database with initial data:
```bash
npx prisma db seed
```

## Troubleshooting

If Prisma Studio or database operations stop working:

1. Regenerate Prisma Client:
```bash
npx prisma generate
```

2. Check database connection:
```bash
npx prisma db pull
```

3. Reset and reseed if needed:
```bash
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  items     Item[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Item Model
```prisma
model Item {
  id        String   @id @default(cuid())
  name      String
  status    Status
  amount    Float
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Status Enum
```prisma
enum Status {
  Active
  Pending
  Inactive
}
```

## Test Data

The seed script creates two test users:
1. Email: `user1@example.com`
   - Has two items: Active ($100) and Pending ($200)

2. Email: `user2@example.com`
   - Has one item: Inactive ($300)

## Best Practices

1. Always backup data before running migrations
2. Use meaningful names for migrations
3. Test migrations on development before production
4. Keep seed data up to date with schema changes
5. Use transactions for multiple database operations

## Common Issues

### Prisma Studio Not Opening
1. Check if port 5555 is available
2. Ensure DATABASE_URL is correct in .env
3. Regenerate Prisma Client
4. Restart the development server

### Migration Errors
1. Check if database is running
2. Verify database credentials
3. Try resetting migrations:
   ```bash
   npx prisma migrate reset
   ```

### Seed Data Errors
1. Ensure seed script is up to date with schema
2. Check for duplicate unique fields
3. Run migration reset if needed

## Database Maintenance

### Regular Tasks
1. Backup database regularly
2. Monitor database size
3. Check for unused indexes
4. Update Prisma dependencies

### Performance
1. Use indexes for frequently queried fields
2. Implement pagination for large datasets
3. Optimize queries using Prisma's select and include

## Security

1. Never commit .env files
2. Use strong passwords
3. Limit database user permissions
4. Regularly update dependencies
5. Implement rate limiting for API routes

## Development Workflow

1. Make schema changes in development
2. Test with Prisma Studio
3. Create and test migrations
4. Update seed data if needed
5. Document changes
6. Deploy to production

## Contact

For database-related issues or questions, contact the development team.
