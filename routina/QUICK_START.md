# Routina - Quick Start Deployment Guide

## Your Application is Ready! 🎉

The complete Routina application has been built and is ready for deployment.

## Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Create Vercel Account
Visit https://vercel.com/signup if you don't have an account

### Step 2: Deploy from Local Directory

#### Using Vercel Dashboard:
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import from local directory"
4. Navigate to `/workspace/routina`
5. Click "Continue"

#### Using Vercel CLI:
```bash
cd /workspace/routina
npm install -g vercel
vercel login
vercel
```

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdnellbxsuwhrlwinfrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTgxMDIsImV4cCI6MjA3Nzc3NDEwMn0.V4-5liFtkn_VZPD_Trrn-Oi5imo6q90_zK-lJvrX3UE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5ODEwMiwiZXhwIjoyMDc3Nzc0MTAyfQ.odFY5u2bebCZ4T9KW_WXXcNfZAF9r45XQnkK2EVSkY0
GEMINI_API_KEY=AIzaSyBLQK60agcd_nEZdbp_0L2SCPk5cD3MzCw
```

### Step 4: Deploy
Click "Deploy" and wait ~2 minutes for build to complete

### Step 5: Test Your App
Visit the deployment URL and test:
1. Sign up / Sign in
2. Complete onboarding
3. Generate a routine
4. Create and track habits
5. View analytics

---

## Option 2: Deploy via GitHub

### Step 1: Push to GitHub
```bash
cd /workspace/routina
git init
git add .
git commit -m "Initial commit - Routina app"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Add environment variables (same as above)
5. Deploy

---

## What You'll Get

### Live Application Features:
- AI-powered routine generation (using Gemini)
- Habit tracking with streaks
- Dynamic re-planning
- Analytics dashboard
- Multi-role support (student, professional, creator, fitness)
- Study planning module
- Responsive design (mobile + desktop)

### Tech Stack Deployed:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Database + Auth)
- Google Gemini AI
- TanStack Query
- Zustand

---

## Troubleshooting

### Build Errors
If build fails:
1. Check environment variables are set correctly
2. Ensure all variables are in "Environment Variables" section
3. Redeploy

### Database Connection Issues
- DATABASE_URL is optional (we use Supabase REST API)
- If needed: Get from Supabase → Project Settings → Database → Connection String

### Need Help?
- Check Vercel deployment logs
- Review `/workspace/routina/DEPLOYMENT.md` for detailed info
- Verify environment variables match exactly

---

## Post-Deployment

### Optional Enhancements:
1. **Custom Domain**: Configure in Vercel settings
2. **Analytics**: Add PostHog key to environment variables
3. **Monitoring**: Enable Vercel Analytics
4. **Performance**: Review Lighthouse scores

### Database Notes:
- All tables are already created in Supabase
- No migrations needed
- Database is production-ready

---

## Project Location
Your complete project is at: `/workspace/routina/`

## Documentation
- `README.md` - Overview and features
- `DEPLOYMENT.md` - Detailed deployment guide
- `PROJECT_SUMMARY.md` - Complete technical summary

---

**Ready to deploy? Choose Option 1 (Vercel Dashboard) for the quickest deployment!**
