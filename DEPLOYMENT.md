# MoodTunes Deployment Guide

Complete step-by-step guide to deploy MoodTunes to Vercel.

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Node.js installed (v14 or higher)
- [ ] Git installed
- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Google Cloud account
- [ ] Spotify Developer account

## Part 1: API Setup

### Google Cloud Natural Language API

1. **Create/Select Project**
   - Go to https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Name it "MoodTunes" and click "Create"

2. **Enable Natural Language API**
   - In the search bar, type "Natural Language API"
   - Click on "Cloud Natural Language API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (save it securely)
   - Optional: Click "Restrict Key" to limit usage to Natural Language API only

4. **Set Up Billing** (Required)
   - Go to "Billing" in the menu
   - Link a billing account (Google provides $300 free credit)
   - Note: The API has a free tier (5,000 requests/month)

### Spotify Web API

1. **Create Spotify App**
   - Go to https://developer.spotify.com/dashboard
   - Log in with your Spotify account
   - Click "Create an App"
   - Fill in:
     - App name: "MoodTunes"
     - App description: "Mood-based music recommendation app"
     - Redirect URI: Leave empty for now
   - Accept terms and click "Create"

2. **Get Credentials**
   - Click on your newly created app
   - Click "Settings"
   - Copy "Client ID"
   - Click "View client secret" and copy "Client Secret"
   - Save both securely

## Part 2: Local Testing

1. **Clone/Setup Project**
   ```bash
   cd MoodTunes
   npm install
   ```

2. **Create .env File**
   ```bash
   # Copy the example file
   copy .env.example .env
   ```

3. **Add Your API Keys to .env**
   ```env
   GOOGLE_NLP_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   SPOTIFY_CLIENT_ID=1234567890abcdef1234567890abcdef
   SPOTIFY_CLIENT_SECRET=1234567890abcdef1234567890abcdef
   ```

4. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

5. **Run Locally**
   ```bash
   vercel dev
   ```

6. **Test the App**
   - Open http://localhost:3000
   - Try entering a mood and see if it works
   - Check browser console for any errors

## Part 3: Deploy to Vercel

### Method A: Using Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```
   - Follow the prompts to authenticate

2. **Deploy to Preview**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? Yes
     - Which scope? Select your account
     - Link to existing project? No
     - Project name? MoodTunes (or press Enter)
     - Directory? ./ (press Enter)
     - Override settings? No

3. **Add Environment Variables**
   ```bash
   vercel env add GOOGLE_NLP_API_KEY
   ```
   - Paste your Google API key when prompted
   - Select "Production, Preview, Development"
   
   ```bash
   vercel env add SPOTIFY_CLIENT_ID
   ```
   - Paste your Spotify Client ID
   - Select "Production, Preview, Development"
   
   ```bash
   vercel env add SPOTIFY_CLIENT_SECRET
   ```
   - Paste your Spotify Client Secret
   - Select "Production, Preview, Development"

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

5. **Your App is Live!**
   - Vercel will provide a URL like: https://moodtunes-xxx.vercel.app
   - Visit the URL to see your live app

### Method B: Using GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/moodtunes.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Click "Import" next to your GitHub repository
   - If not connected, click "Connect GitHub Account"

3. **Configure Project**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: public
   - Install Command: npm install

4. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Add each variable:
     - Name: `GOOGLE_NLP_API_KEY`, Value: (your key)
     - Name: `SPOTIFY_CLIENT_ID`, Value: (your client ID)
     - Name: `SPOTIFY_CLIENT_SECRET`, Value: (your secret)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (1-2 minutes)
   - Click "Visit" to see your live app

## Part 4: Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update Spotify Redirect URI**
   - Go to Spotify Developer Dashboard
   - Edit your app settings
   - Add your custom domain to Redirect URIs

## Troubleshooting

### API Key Errors

**Problem**: "API key not configured"
- **Solution**: Ensure environment variables are set in Vercel
- Go to Project Settings → Environment Variables
- Verify all three keys are present
- Redeploy after adding variables

### Google NLP API Errors

**Problem**: "API key not valid"
- **Solution**: 
  - Check if Natural Language API is enabled
  - Verify API key is correct
  - Check if billing is enabled

**Problem**: "Quota exceeded"
- **Solution**: 
  - Check usage in Google Cloud Console
  - Upgrade to paid tier if needed
  - Free tier: 5,000 requests/month

### Spotify API Errors

**Problem**: "Failed to get access token"
- **Solution**:
  - Verify Client ID and Secret are correct
  - Check if they're properly set in environment variables
  - Ensure no extra spaces in the values

**Problem**: "No tracks found"
- **Solution**:
  - This is normal for some mood/genre combinations
  - Try different mood descriptions
  - Check Spotify API status

### Deployment Errors

**Problem**: Build fails
- **Solution**:
  - Check build logs in Vercel dashboard
  - Ensure package.json is correct
  - Verify all files are committed to Git

**Problem**: 404 errors
- **Solution**:
  - Check vercel.json routing configuration
  - Ensure public folder exists
  - Verify file paths are correct

### CORS Errors

**Problem**: CORS policy blocking requests
- **Solution**:
  - Serverless functions should handle CORS automatically
  - Check if Access-Control-Allow-Origin headers are set
  - Verify you're calling the correct API endpoints

## Monitoring & Maintenance

### Check Logs
```bash
vercel logs [deployment-url]
```

### View Analytics
- Go to Vercel Dashboard → Your Project → Analytics
- Monitor traffic, errors, and performance

### Update Environment Variables
```bash
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

### Redeploy
```bash
vercel --prod
```

## Cost Estimation

### Free Tier Limits

**Vercel**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless function executions: 100 GB-hours

**Google Cloud NLP**
- 5,000 requests/month free
- $1.00 per 1,000 requests after

**Spotify API**
- Completely free
- Rate limits apply (varies by endpoint)

### Expected Costs for Small App
- **0-1000 users/month**: $0 (within free tiers)
- **1000-5000 users/month**: $0-5
- **5000+ users/month**: $10-50 (depending on usage)

## Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Use environment variables in Vercel

2. **Restrict API Keys**
   - Google: Restrict to Natural Language API only
   - Add HTTP referrer restrictions

3. **Monitor Usage**
   - Set up billing alerts in Google Cloud
   - Monitor Vercel usage dashboard

4. **Rate Limiting**
   - Consider adding rate limiting to serverless functions
   - Use Vercel's built-in DDoS protection

## Next Steps

After successful deployment:

1. **Test thoroughly**
   - Try different moods
   - Test in different languages
   - Check mobile responsiveness

2. **Share your app**
   - Share the Vercel URL
   - Add to your portfolio

3. **Monitor performance**
   - Check Vercel Analytics
   - Monitor API usage

4. **Iterate and improve**
   - Add new features
   - Optimize performance
   - Gather user feedback

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify API keys are correct
4. Check API quotas and limits
5. Review this troubleshooting guide

---

Congratulations! Your MoodTunes app is now live! 🎉
