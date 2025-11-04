# Routina Deployment Guide

## Prerequisites
- Vercel account
- Environment variables configured

## Environment Variables Required

Set these in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdnellbxsuwhrlwinfrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTgxMDIsImV4cCI6MjA3Nzc3NDEwMn0.V4-5liFtkn_VZPD_Trrn-Oi5imo6q90_zK-lJvrX3UE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5ODEwMiwiZXhwIjoyMDc3Nzc0MTAyfQ.odFY5u2bebCZ4T9KW_WXXcNfZAF9r45XQnkK2EVSkY0
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.mdnellbxsuwhrlwinfrn.supabase.co:5432/postgres
GEMINI_API_KEY=AIzaSyBLQK60agcd_nEZdbp_0L2SCPk5cD3MzCw
```

## Deployment Steps

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

## Build Command
```
pnpm prisma generate && pnpm build
```

## Database Setup
Tables are already created in Supabase:
- preferences
- plans
- habits
- checkins
- reminders

## Post-Deployment Testing
1. Sign up for a new account
2. Complete onboarding
3. Generate a routine
4. Create and track habits
5. View analytics

## Support
For issues, check the logs in Vercel dashboard.
