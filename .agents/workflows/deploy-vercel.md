---
description: Deploy the Next.js Application to Vercel
---
### Vercel Deployment Checklist

1. Make sure the Vercel CLI is installed (`npm i -g vercel`).
// turbo
2. Link the current project to Vercel
```bash
npx vercel link
```
3. Build the Next.js deployment package
```bash
npx vercel build
```
4. Deploy to production
```bash
npx vercel deploy --prod
```
