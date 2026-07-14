# Dummy URL / Free Hosting Options

## Option 1: Netlify (Recommended for Quick Preview)

Netlify gives you an instant auto-generated URL and auto-deploys on every push.

### Setup (5 minutes):

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up** with your GitHub account
3. **Click "New site from Git"**
4. **Select your GitHub repository**: `nehanegi011/Nevic-Labs`
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.`
6. **Deploy!**

You'll get a URL like: **`https://your-site-name.netlify.app`**

### Auto-Deploy:
- Push to `staging` → Auto-deploy preview
- Push to `main` → Auto-deploy production
- Creates preview URLs for each PR!

---

## Option 2: GitHub Pages (Built-in, Free)

Since your code is on GitHub, you get a free URL out of the box.

### Setup:

1. Go to your **GitHub repo** → **Settings** → **Pages**
2. Set source to: `Deploy from a branch`
3. Select branch: `main`
4. GitHub will generate a URL: **`https://nehanegi011.github.io/Nevic-Labs/`**

- No extra configuration needed
- Updates automatically when you push to `main`

### Create Preview for Staging:

Create a separate `gh-pages-staging` branch with different settings in Pages.

---

## Option 3: Free Local Testing (Before Any Upload)

Test locally without any external hosting:

```bash
# Install Python (if not already installed)
# Or use Node.js http-server

# Option A: Python built-in server
cd "c:\Nevic Pulse\nevic-site"
python -m http.server 8000

# Option B: Node.js
npm install -g http-server
http-server

# Visit: http://localhost:8000
```

---

## Recommended Workflow:

```
Local Testing (localhost)
    ↓
Push to staging branch
    ↓
Netlify auto-deploys → https://your-site.netlify.app
    ↓
Test thoroughly on Netlify
    ↓
Create PR to main
    ↓
Merge to main
    ↓
GitHub Pages + Netlify auto-deploy to production
```

---

## Quick Summary of Dummy URLs:

| Option | URL Format | Setup Time | Auto-Deploy |
|--------|-----------|-----------|------------|
| **Netlify** | `sitename.netlify.app` | 5 min | ✅ Yes |
| **GitHub Pages** | `username.github.io/repo` | 2 min | ✅ Yes |
| **Local** | `localhost:8000` | 1 min | ❌ Manual |

---

I recommend **Netlify** for the easiest preview experience!
