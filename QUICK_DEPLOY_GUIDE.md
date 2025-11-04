# 🚀 VERCEL DEPLOYMENT - ROUTINA APP
## Quick Start Guide (2-3 minutes)

### STEP 1: Get Your Project Files
Download all files from the workspace to your computer. Key files include:
- `package.json`
- `app/` folder (with all your pages)
- `lib/` folder (utilities)
- `components/` folder
- `.env.local` (environment variables)
- Configuration files

### STEP 2: Go to Vercel
1. Visit: **https://vercel.com**
2. Sign up for free (GitHub, Google, or email)
3. You'll see the Vercel dashboard

### STEP 3: Deploy Now

#### Option A: GitHub (Easiest)
1. Create account on **https://github.com**
2. Create new repository called "routina-ai-routine-builder"
3. Upload all your project files to GitHub
4. In Vercel → "New Project" → "Import Git Repository"
5. Select your GitHub repo → Click "Import"

#### Option B: Direct Upload
1. In Vercel → "New Project" → "Browse All Templates"
2. Click "Import" and select your downloaded folder
3. Wait for upload

### STEP 4: Add Environment Variables
In Vercel project → Settings → Environment Variables, add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdnellbxsuwhrlwinfrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTgxMDIsImV4cCI6MjA3Nzc3NDEwMn0.V4-5liFtkn_VZPD_Trrn-Oi5imo6q90_zK-lJvrX3UE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5ODEwMiwiZXhwIjoyMDc3Nzc0MTAyfQ.odFY5u2bebCZ4T9KW_WXXcNfZAF9r45XQnkK2EVSkY0
GEMINI_API_KEY=AIzaSyBLQK60agcd_nEZdbp_0L2SCPk5cD3MzCw
GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
```

### STEP 5: Deploy!
1. Click "Deploy" button in Vercel
2. Wait 1-2 minutes for build to complete
3. Get your live URL: `https://routina-xxxx.vercel.app`

### ✅ That's it! Your app is live!

**What's working:**
- User authentication (Supabase Auth)
- AI routine generation (Google Gemini API)
- Habit tracking and analytics
- Responsive design
- Database integration

**Next steps:**
- Visit your app and test the features
- Share the URL with others
- Optionally add custom domain

⚡ **Total time:** 2-3 minutes
💰 **Cost:** Free tier (plenty for MVP)
🌍 **Performance:** Global CDN automatically

---
**Need help?** Vercel documentation is excellent at vercel.com/docs