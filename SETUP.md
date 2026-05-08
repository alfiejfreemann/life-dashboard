# Life Dashboard — Setup Guide

Everything you need to get this running, step by step. No coding experience needed.

---

## Step 1 — Install Node.js

1. Go to **https://nodejs.org**
2. Download the **LTS version** (big green button)
3. Run the installer — click Next through everything
4. Restart your computer after install

**Test it worked:** Open PowerShell (search "PowerShell" in Start menu) and type:
```
node --version
```
It should print something like `v20.11.0`

---

## Step 2 — Install Dependencies

1. Open PowerShell
2. Type this and press Enter:
```
cd C:\Users\alfie\life-dashboard
npm install
```
Wait for it to finish (1-2 minutes, you'll see packages downloading)

---

## Step 3 — Set Up Supabase (your database + login)

1. Go to **https://supabase.com** → Sign Up (free)
2. Click **"New Project"**
3. Name it `life-dashboard`, choose a password (save it!), pick region: **Singapore** (closest to Sydney)
4. Wait ~2 minutes for project to create
5. Go to **Settings → API** in your project
6. Copy your **Project URL** and **anon public key**

7. In `C:\Users\alfie\life-dashboard`, create a file called `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
(Replace with your actual values)

8. **Create the database tables:**
   - In Supabase, go to **SQL Editor** (left sidebar)
   - Click **"New query"**
   - Open `C:\Users\alfie\life-dashboard\supabase\schema.sql` in Notepad
   - Copy everything, paste into Supabase SQL editor
   - Click **"Run"**

---

## Step 4 — Run Locally (test it works)

In PowerShell:
```
cd C:\Users\alfie\life-dashboard
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see your dashboard! 🎉

---

## Step 5 — Deploy to Vercel (make it live on the internet)

1. Go to **https://github.com** → Sign up if you don't have an account
2. Click **"New repository"** → name it `life-dashboard` → Create
3. In PowerShell (in your project folder):
```
git init
git add .
git commit -m "Initial dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-dashboard.git
git push -u origin main
```
(Replace YOUR_USERNAME with your GitHub username)

4. Go to **https://vercel.com** → Sign up with GitHub
5. Click **"New Project"** → Import your `life-dashboard` repo
6. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase key
7. Click **Deploy**

Your dashboard will be live at `https://life-dashboard-xxx.vercel.app` 🚀

---

## Step 6 — Add to iPhone Home Screen (PWA)

1. Open Safari on your iPhone
2. Go to your Vercel URL
3. Tap the **Share button** (box with arrow pointing up)
4. Scroll down → tap **"Add to Home Screen"**
5. Name it "Dashboard" → tap Add

It'll appear on your home screen like an app, opening directly to the dashboard.

---

## Step 7 — iPhone Widgets (Scriptable)

For actual widgets on your home screen:

1. Download **Scriptable** from the App Store (free)
2. Open Scriptable → tap **"+"** top right
3. Open `C:\Users\alfie\life-dashboard\scriptable\widget.js` on your computer
4. Copy ALL of the code
5. Paste it into Scriptable
6. Change line 10: replace `your-app.vercel.app` with your actual Vercel URL
7. Tap the script name at top → rename to **"Life Dashboard"** → Done

**Add the widget:**
1. Long press your iPhone home screen
2. Tap **"+"** top left → search "Scriptable"
3. Choose widget size (Small / Medium / Large)
4. Add Widget → Long press the new widget → Edit Widget
5. Script: **Life Dashboard** → Done

**Available sizes:**
- **Small** = Hyrox countdown (great for lock screen!)
- **Medium** = Countdown + key stats + today's mission
- **Large** = Full snapshot of everything

**For lock screen widgets** (iOS 16+):
- Long press your lock screen → Customise → Lock Screen
- Tap widget area below the time
- Add Scriptable → select "Life Dashboard" (small size)

---

## Step 8 — Connect Garmin (when your Epix arrives)

Once your Garmin Epix Pro Gen 2 arrives:
1. Install **Garmin Connect** on your iPhone
2. Sync your watch after every session
3. Your HRV + sleep data will be visible in Garmin Connect
4. Manually enter your HRV each morning in the Recovery page
5. (Future upgrade: we can connect the Garmin Connect API to auto-import everything)

---

## Daily Usage

**Morning routine:**
- Check the widget on your phone for today's priorities
- Open the dashboard → log your morning HRV and weight
- See exactly what training to do today

**After training:**
- Log workout (type, duration, HR, distance)
- Log nutrition (or do it throughout the day)

**Weekly:**
- Check your Hyrox station times are improving
- Update finance log with monthly income

---

## Need help?

If anything breaks or you get stuck, copy the error message and show it to Claude.
Every error has a fix — don't give up!
