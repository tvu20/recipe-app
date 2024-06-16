This is a starter template for [Learn Next.js](https://nextjs.org/learn).

# Setup

Install Node and NPM if not already on the system. Then run the following commands:

```
npm install
npx prisma generate
npm run dev
```

# Updating Prisma Schema

After performing an update, you need to run the following commands:

```
npx prisma db push      // pushes the database schema
npx prisma generate     // generates a new Prisma client
```

You can seed the database using Prisma Studio:

```
npx prisma studio
```

# Launching Next.js App

```
npm run dev
```

# Deploying to Vercel

Merge into main branch.
