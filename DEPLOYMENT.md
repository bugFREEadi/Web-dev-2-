# 🚀 Deployment Guide

This guide covers deploying your Finance Tracker app to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors
- [ ] No unused dependencies
- [ ] Environment variables configured
- [ ] Data backup planned
- [ ] Performance optimized

## 🏗 Build Preparation

### 1. Create Production Build

```bash
npm run build
```

This generates:

- Minified JavaScript
- Optimized CSS
- Compressed images
- Production-ready assets in `dist/` folder

### 2. Verify Build

```bash
npm run preview
```

This serves the production build locally to test before deployment.

## ☁️ Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is perfect for Vite/React apps. It offers free hosting with automatic deployments.

#### Steps:

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "React" as framework
   - Click "Deploy"

3. **Configure Environment**
   - In Project Settings > Environment Variables
   - Add `VITE_EXCHANGE_RATE_API_KEY`
   - Add `VITE_NEWS_API_KEY`

4. **Done!** Your app is deployed
   - Live URL provided automatically
   - Auto-deploys on push to main

### Option 2: Netlify

Another excellent free option with CDN.

#### Steps:

1. **Build your project**

   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Select "Deploy manually"
   - Drag and drop the `dist` folder

3. **Or Connect Git**
   - Click "Link site to Git"
   - Select GitHub
   - Choose your repository
   - Build settings will auto-populate

4. **Environment Variables**
   - Site Settings > Build & Deploy > Environment
   - Add your API keys

### Option 3: GitHub Pages

Free hosting directly from GitHub.

#### Steps:

1. **Update vite.config.js**

   ```javascript
   export default defineConfig({
     base: "/finance-tracker/", // Replace with your repo name
     // ... rest of config
   });
   ```

2. **Build and Deploy**

   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git push origin $(git rev-parse --abbrev-ref HEAD)
   ```

3. **Configure GitHub Pages**
   - Repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: main (or your branch with dist folder)

### Option 4: AWS Amplify

For more complex hosting needs.

#### Steps:

1. **Install Amplify CLI**

   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify**

   ```bash
   amplify init
   ```

3. **Add Hosting**

   ```bash
   amplify add hosting
   # Select "Hosting with Amplify Console"
   ```

4. **Deploy**
   ```bash
   amplify publish
   ```

### Option 5: Firebase Hosting

Google's hosting solution.

#### Steps:

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**

   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json**

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🌍 Domain Configuration

### Add Custom Domain

**For Vercel:**

- Project Settings > Domains
- Add your custom domain
- Follow DNS configuration steps

**For Netlify:**

- Domain Settings > Custom Domains
- Add your domain
- Update DNS records

**For GitHub Pages:**

- Repository Settings > Pages
- Add custom domain under "Custom domain"
- Update DNS CNAME record

## 🔒 Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
VITE_EXCHANGE_RATE_API_KEY=your_production_key
VITE_NEWS_API_KEY=your_production_key
```

### Protecting Sensitive Data

- Never commit API keys to Git
- Use platform's environment variable settings
- Rotate keys periodically
- Monitor API usage

## 📊 Performance Optimization

### Before Deploying

1. **Run Build Analysis**

   ```bash
   npm run build -- --analyze
   ```

2. **Check Bundle Size**
   - Use [Bundle Phobia](https://bundlephobia.com)
   - Analyze `dist` folder size

3. **Optimize Images**
   - Use modern formats (WebP)
   - Compress all images
   - Lazy load images

4. **Code Splitting**
   - Vite does this automatically
   - Monitor chunk sizes

### Lighthouse Audit

```bash
# Build production
npm run build

# Run Lighthouse (requires Chrome)
# DevTools > Lighthouse > Analyze page load
```

Target scores:

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🔍 Monitoring & Analytics

### Add Analytics

**Google Analytics:**

```bash
npm install react-ga4
```

```javascript
// In main.jsx
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXXXXX");
ReactGA.send(pageview);
```

**Sentry for Error Tracking:**

```bash
npm install @sentry/react
```

## 🚨 Error Handling

### Set Error Boundaries

Error boundaries automatically capture errors in production.

```javascript
// Create ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 🔄 Continuous Deployment (CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        run: npm install -g vercel && vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📱 Progressive Web App (PWA)

### Add Web App Manifest

Create `src/manifest.json`:

```json
{
  "name": "Finance Tracker",
  "short_name": "Finance",
  "description": "Personal Finance & Expense Analytics App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Link in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
```

## 🗄 Database Integration (Optional)

### Using Firebase Firestore

```bash
npm install firebase
```

```javascript
// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS configured
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting

## 📈 Post-Deployment

### Monitoring

1. **Check Site Status**
   - Test all pages
   - Verify all links
   - Test forms

2. **Monitor Performance**
   - Check Core Web Vitals
   - Monitor error rates
   - Track user analytics

3. **Setup Alerts**
   - Error alerts
   - Downtime notifications
   - Performance alerts

## 🔄 Updates & Rollback

### Deploying Updates

1. **Test locally**

   ```bash
   npm run dev
   ```

2. **Build and deploy**
   ```bash
   npm run build
   # Deployment happens automatically
   ```

### Rollback Procedure

**Vercel:**

- Deployments > Select previous deploy > Promote to Production

**Netlify:**

- Deploys > Click previous deploy > Publish deploy

**GitHub Pages:**

- Revert Git commit: `git revert HEAD`

## 🎯 Deployment Checklist

### Before Going Live

- [ ] All features working
- [ ] No console errors
- [ ] Mobile tested
- [ ] Performance optimized
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Analytics configured
- [ ] SSL certificate valid
- [ ] Backup strategy planned
- [ ] Monitoring setup

### Deployment Command

```bash
# Quick deploy to Vercel (after setup)
vercel

# Or through Git
git push origin main
```

## 📞 Support

For deployment issues:

- Check platform's documentation
- Review error logs
- Test build locally
- Clear browser cache
- Check browser console
- Verify environment variables

---

**Happy Deploying! 🚀**

Your Finance Tracker is now production-ready and can be deployed to any of these platforms.
