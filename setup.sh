#!/bin/bash

# Kodotakai Setup Script
# This script automates the installation process

echo "🚀 Kodotakai Installation Script"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if pnpm is installed, install if not
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install pnpm. Please install manually:"
        echo "   npm install -g pnpm"
        exit 1
    fi
fi

echo "✅ pnpm $(pnpm --version) detected"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install additional React dependencies if needed
echo "🔧 Installing React types..."
pnpm add react @types/react @types/react-dom

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "To start the development server:"
echo "  pnpm run dev"
echo ""
echo "The app will be available at: http://localhost:5173/"
echo ""
echo "📖 For more details, see INSTALLATION.md"
