# 🚀 Deployment Guide

## Quick Deployment Options

### Option 1: Heroku + Netlify (Recommended)

#### Backend on Heroku
1. Create account at [heroku.com](https://heroku.com)
2. Install Heroku CLI
3. In your project root:
   ```bash
   heroku create your-recipe-api
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

#### Frontend on Netlify
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
4. Update `netlify.toml` with your Heroku URL

### Option 2: Vercel (Full Stack)
1. Create account at [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Vercel will auto-detect and deploy both frontend and backend

### Option 3: Railway (Backend) + Netlify (Frontend)
1. Deploy backend to [railway.app](https://railway.app)
2. Deploy frontend to Netlify as above

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
```

### Frontend (Update in App.js)
```javascript
const API_BASE = 'https://your-deployed-backend-url.com';
```

## Pre-Deployment Checklist
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] API URLs updated for production
- [ ] Error handling tested
- [ ] Mobile responsiveness verified
- [ ] All features working locally

## Post-Deployment Testing
1. Test recipe search functionality
2. Verify image upload works
3. Check filtering options
4. Test mobile responsiveness
5. Verify error handling

## Troubleshooting
- **CORS errors**: Ensure backend allows frontend domain
- **API not found**: Check API URL configuration
- **Build failures**: Verify all dependencies in package.json
- **Images not loading**: Check file paths and permissions

Your app will be live and accessible worldwide! 🌍