# 🚀 Deployment Guide - Smart Recipe Generator

## Quick Deploy (5 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Connect your repository**
6. **Railway will auto-deploy the backend**
7. **Copy your Railway URL** (e.g., `https://smart-recipe-generator-production.up.railway.app`)

### Step 2: Deploy Frontend to Netlify

1. **Go to [Netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Connect your repository**
5. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
6. **Environment variables:**
   - Key: `REACT_APP_API_URL`
   - Value: Your Railway URL from Step 1
7. **Deploy site**

## Alternative: Vercel (Full Stack)

### Deploy to Vercel (Both Frontend & Backend)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Vercel auto-detects and deploys both**
4. **Set environment variable:**
   - `REACT_APP_API_URL` = your Vercel backend URL

## Manual Setup (if needed)

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=production
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Testing Your Deployment

1. **Visit your Netlify URL**
2. **Test ingredient search**
3. **Try image upload**
4. **Check all features work**

## Troubleshooting

### Common Issues:
- **CORS Error**: Backend not allowing frontend domain
- **API Not Found**: Wrong API URL in environment variables
- **Build Failed**: Missing dependencies

### Solutions:
1. **Check environment variables**
2. **Verify API URL is correct**
3. **Check build logs for errors**

## Your Live URLs:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-app-name.up.railway.app`

🎉 **Your Smart Recipe Generator is now live!**