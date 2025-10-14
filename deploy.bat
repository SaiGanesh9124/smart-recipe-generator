@echo off
echo 🚀 Smart Recipe Generator - Deployment Helper
echo.

echo 📦 Installing dependencies...
echo.

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend  
call npm install
cd ..

echo.
echo ✅ Dependencies installed!
echo.

echo 🔧 Building frontend for production...
cd frontend
call npm run build
cd ..

echo.
echo ✅ Build complete!
echo.

echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Railway: https://railway.app
echo 3. Deploy frontend to Netlify: https://netlify.com
echo 4. Set REACT_APP_API_URL environment variable
echo.

echo 📖 See DEPLOY.md for detailed instructions
pause