@echo off
echo 🚀 Kodotakai Installation Script (Windows)
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18 or higher) first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm. Please install manually:
        echo    npm install -g pnpm
        pause
        exit /b 1
    )
)

echo ✅ pnpm detected:
pnpm --version

REM Install dependencies
echo 📥 Installing dependencies...
pnpm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Install additional React dependencies
echo 🔧 Installing React types...
pnpm add react @types/react @types/react-dom

echo.
echo 🎉 Installation completed successfully!
echo.
echo To start the development server:
echo   pnpm run dev
echo.
echo The app will be available at: http://localhost:5173/
echo.
echo 📖 For more details, see INSTALLATION.md
echo.
pause
