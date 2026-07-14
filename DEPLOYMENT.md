# GitHub Deployment Setup

Your Nevic Labs site is now connected to GitHub with automated staging and production deployments!

## 🚀 Quick Start

### Branch Structure:
- **`main`** → Production (nevic-labs.com)
- **`staging`** → Staging (staging.nevic-labs.com)

### Deployment Flow:
1. Push changes to `staging` branch
2. GitHub Actions automatically builds and deploys to staging environment
3. Test staging deployment
4. Create a Pull Request to merge into `main`
5. Once merged to `main`, GitHub Actions automatically deploys to production

## 📋 Setup Checklist

### 1. Configure GitHub Pages

Go to your repository settings:
1. Navigate to **Settings** → **Pages**
2. Set **Source** to `Deploy from a branch`
3. Select `main` branch
4. Choose root folder as the publish directory

### 2. Set Custom Domains

For production:
1. Settings → Pages → **Custom domain**: `nevic-labs.com`
2. Update DNS CNAME record to point to GitHub Pages

For staging:
1. Settings → Pages → **Custom domain**: `staging.nevic-labs.com`
2. Update DNS CNAME record to point to GitHub Pages

### 3. Enable Branch Protection (Optional but Recommended)

Protect your `main` branch from accidental deployments:

1. Settings → **Branches** → **Add rule**
2. Pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date

### 4. Set Default Branch

Settings → **Default branch** → Change to `main`

### 5. Configure Secrets (Optional)

For Slack notifications, add:
1. Settings → **Secrets and variables** → **Actions**
2. Add new secret: `SLACK_WEBHOOK` with your webhook URL

## 🔄 Workflow

### Making Changes:

```bash
# Create a feature branch
git checkout -b feature/my-changes

# Make your changes
# ...

# Commit and push
git add .
git commit -m "Add my changes"
git push origin feature/my-changes

# Create a PR to staging for review
# → Merges to staging automatically deploy

# Create a PR from staging to main for production
```

### Example: Adding a Blog Post

```bash
# Create new post
npm run new-post

# This generates:
# - A new HTML file in blog/posts/
# - Updates data/posts.json

# Commit and push to feature branch
git add .
git commit -m "Add new blog post"
git push origin feature/my-posts

# Create PR to staging → test → merge to main
```

## 🧪 Testing Staging Before Production

1. Push to `staging` branch
2. Wait ~2-5 minutes for GitHub Actions to complete
3. Visit `https://staging.nevic-labs.com`
4. Test all changes thoroughly
5. When satisfied, create PR to merge `staging` → `main`

## 📊 View Deployment Status

- GitHub → **Actions** tab to see workflow runs
- Check deployment logs and build output
- See any errors or warnings

## 🛠️ Local Development

While staging/production are automated, you can test locally:

```bash
# Install dependencies
npm install

# Build the site (regenerates blog)
npm run build

# Open in browser
# (Serve files using a local server or open .html files directly)
```

## 🔑 Important Notes

- **Never force push to `main`** after production is live
- Changes merge to `staging` as-is; use PRs for code review
- Build takes 1-5 minutes depending on size
- GitHub Actions runs are free (up to 2000 minutes/month)

## ❓ Troubleshooting

### Deployment failed?
1. Check **Actions** tab for error logs
2. Verify `npm run build` works locally
3. Check for any syntax errors in HTML/CSS/JS

### Pages not updating?
1. Clear browser cache
2. Wait 5 minutes for DNS propagation
3. Check if commit actually pushed to correct branch

### Need to rollback?
1. Revert the commit on `main`
2. Push the revert commit
3. GitHub Actions will automatically redeploy with the fix

---

**Your site is now production-ready!** 🎉
Remember: stage changes in `staging` before merging to `main`.
