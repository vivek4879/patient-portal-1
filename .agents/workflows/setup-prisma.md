---
description: Initialize and Setup Prisma PostgreSQL Database
---
### Prisma ORM Initialization

1. Install Prisma CLI as a dev dependency
```bash
npm install prisma --save-dev
```
// turbo
2. Initialize Prisma (creates prisma folder and .env file)
```bash
npx prisma init
```
3. After updating `prisma/schema.prisma` with your models, sync the database:
```bash
npx prisma db push
```
4. Generate the Prisma Client
```bash
npx prisma generate
```
