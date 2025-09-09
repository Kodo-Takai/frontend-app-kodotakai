# Kodotakai - Installation Guide

## 🚀 Quick Start

This guide will help you set up and run the Kodotakai authentication application on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **pnpm** (recommended) or **npm**
- **Git**

### Check Your Installation

```bash
# Check Node.js version
node --version

# Check pnpm version (install if needed)
pnpm --version

# If pnpm is not installed, install it globally
npm install -g pnpm
```

## 🛠️ Installation Steps

### 1. Clone or Download the Project

If you have the project as a ZIP file:
```bash
# Extract the ZIP file and navigate to the directory
cd frontend-app-kodotakai-main
```

If cloning from a repository:
```bash
git clone <repository-url>
cd frontend-app-kodotakai-main
```

### 2. Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Install Additional Dependencies (if needed)

If you encounter any React type issues, run:
```bash
pnpm add react @types/react @types/react-dom
```

### 4. Start the Development Server

```bash
pnpm run dev
```

Or with npm:
```bash
npm run dev
```

### 5. Open in Browser

The application will be available at:
```
http://localhost:5173/
```

## 🎯 Expected Behavior

When you successfully start the application, you should see:

1. **Splash Screen** - Shows for 3 seconds with the Kodotakai logo
2. **Login Form** - Clean form with empty email and password fields
3. **Professional UI** - No test data or placeholder content

## 📱 Features

- **Professional Authentication System**
- **Splash Screen with Branding**
- **User Registration & Login**
- **Session Management**
- **Responsive Design**
- **Form Validation**
- **localStorage-based Data Persistence**

## 🔧 Available Scripts

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

## 🏗️ Project Structure

```
frontend-app-kodotakai-main/
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Home.tsx
│   │   ├── Input.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── SplashScreen.tsx
│   ├── hooks/
│   │   ├── useAuthForm.ts
│   │   └── useSplash.ts
│   ├── services/
│   │   └── apiService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🧪 Testing the Application

### Login Flow
1. Visit `http://localhost:5173/`
2. Wait for splash screen (3 seconds)
3. Try logging in with any email/password
4. Register a new account
5. Test the session persistence by refreshing the page

### Registration Flow
1. Click "Sign up" on the login page
2. Fill in all required fields
3. Submit the form
4. You'll be redirected to the home page

## 🛠️ Troubleshooting

### Common Issues

**Issue: Port 5173 is already in use**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or start on a different port
pnpm run dev --port 3000
```

**Issue: Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**Issue: TypeScript errors**
```bash
# Install React types
pnpm add @types/react @types/react-dom

# Check TypeScript configuration
pnpm run type-check
```

**Issue: Build errors**
```bash
# Clean build cache
rm -rf dist
pnpm run build
```

## 🚀 Production Deployment

### Build for Production
```bash
pnpm run build
```

### Preview Production Build
```bash
pnpm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔒 Security Features

- Password validation
- Email format validation
- Session token management
- Secure localStorage handling
- Input sanitization

## 📞 Support

If you encounter any issues during installation or setup:

1. Check that all prerequisites are installed
2. Ensure you're using the correct Node.js version
3. Try clearing the cache and reinstalling dependencies
4. Check the browser console for any error messages

## 🎨 Customization

The application is built with modern React and TypeScript, making it easy to customize:

- **Styling**: CSS files in each component directory
- **Branding**: Update logo and colors in the splash screen
- **Authentication**: Modify the `apiService.ts` for different backends
- **UI Components**: All components are modular and reusable

---

**Congratulations! 🎉** 

Your Kodotakai authentication application should now be running successfully. Enjoy building your professional authentication system!
