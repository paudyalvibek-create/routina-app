# 🚀 Routina - AI-Powered Routine Builder
## Vercel Deployment Guide

### Step 1: Prepare Your Files
First, download all the files from the workspace to your local computer. You'll need:
- All source code files
- `package.json` 
- `.env.local` (with environment variables)
- All configuration files

### Step 2: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up for free (or login if you have an account)
3. You can sign up with GitHub, Google, or email

### Step 3: Deploy Your Project

#### Option A: Deploy via GitHub (Recommended)
1. **Create a GitHub Repository:**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `routina-ai-routine-builder` (or any name you prefer)
   - Upload all your project files to this repository

2. **Connect to Vercel:**
   - In Vercel dashboard, click "New Project"
   - Choose "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

#### Option B: Deploy Directly (Manual Upload)
1. In Vercel dashboard, click "New Project"
2. Choose "Browse All Templates"
3. Click "Import" and select your project files
4. Wait for upload to complete

### Step 4: Configure Environment Variables
Add these environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdnellbxsuwhrlwinfrn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTgxMDIsImV4cCI6MjA3Nzc3NDEwMn0.V4-5liFtkn_VZPD_Trrn-Oi5imo6q90_zK-lJvrX3UE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbmVsbGJ4c3V3aHJsd2luZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE5ODEwMiwiZXhwIjoyMDc3Nzc0MTAyfQ.odFY5u2bebCZ4T9KW_WXXcNfZAF9r45XQnkK2EVSkY0
DATABASE_URL=postgresql://postgres.mdnellbxsuwhrlwinfrn:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
GEMINI_API_KEY=AIzaSyBLQK60agcd_nEZdbp_0L2SCPk5cD3MzCw
GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**To add environment variables:**
1. In your Vercel project dashboard, go to "Settings" tab
2. Click "Environment Variables"
3. Click "Add" and add each variable individually
4. Make sure to set them for "Production", "Preview", and "Development"

### Step 5: Deploy
1. Click "Deploy" button
2. Wait for deployment to complete (usually 1-2 minutes)
3. Once deployed, Vercel will provide you with a live URL like: `https://your-app.vercel.app`

### Step 6: Your Live App!
🎉 **Congratulations!** Your Routina app is now live!

Your app includes:
- ✅ User authentication (signup/login)
- ✅ AI-powered routine generation using Google Gemini
- ✅ Habit tracking and analytics
- ✅ Routine planning and management
- ✅ Responsive design for all devices
- ✅ Supabase backend integration

### Optional: Custom Domain
1. In Vercel project settings, go to "Domains"
2. Add your custom domain if you have one
3. Configure DNS settings as instructed by Vercel

### Troubleshooting
- **Build fails?** Check that all dependencies in package.json are correct
- **Environment variables missing?** Ensure all required env vars are set
- **Database connection issues?** Verify your Supabase credentials
- **AI features not working?** Check your Gemini API key is valid

### Support
If you encounter any issues, Vercel provides excellent documentation and support:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel Guide](https://vercel.com/docs/frameworks/nextjs)

---
**Deployment Time:** ~2-3 minutes
**Cost:** Free tier available
**Performance:** Global CDN included automatically