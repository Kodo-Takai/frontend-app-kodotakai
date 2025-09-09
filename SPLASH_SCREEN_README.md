# Splash Screen Component

A beautiful, animated splash screen component for the Kodotakai application.

## Features

- ✨ **Animated Logo**: Floating and rotating logo animation
- 🎨 **Gradient Background**: Beautiful gradient background with app's main colors
- ⏱️ **Configurable Duration**: Default 3 seconds, customizable
- 🔄 **Smooth Transitions**: Fade-in and fade-out animations
- 📱 **Responsive Design**: Works on all screen sizes
- ♿ **Accessibility**: Respects user's motion preferences
- 🎯 **Auto-redirect**: Automatically redirects to Login after splash

## Usage

### Basic Usage

```tsx
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Login />
      )}
    </>
  );
}
```

### Advanced Usage with Custom Props

```tsx
<SplashScreen
  onComplete={handleSplashComplete}
  duration={2500}          // Custom duration (2.5 seconds)
  logo="/custom-logo.svg"  // Custom logo
  appName="My App"         // Custom app name
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `() => void` | **required** | Callback function called when splash completes |
| `duration` | `number` | `3000` | Duration in milliseconds |
| `logo` | `string` | `"/vite.svg"` | Path to logo image |
| `appName` | `string` | `"Kodotakai"` | Application name to display |

## useSplash Hook

The `useSplash` hook provides the core timing logic for the splash screen.

### Usage

```tsx
import { useSplash } from './hooks/useSplash';

const { isVisible, isAnimating } = useSplash({
  duration: 3000,
  onComplete: () => console.log('Splash completed!')
});
```

### Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `3000` | Duration in milliseconds |
| `onComplete` | `() => void` | `undefined` | Callback when splash completes |

### Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `isVisible` | `boolean` | Whether splash screen should be visible |
| `isAnimating` | `boolean` | Whether fade-in animation is active |

## Animations

The splash screen includes several animations:

- **Fade In/Out**: Smooth opacity transitions
- **Logo Float**: Gentle up-down movement
- **Logo Rotate**: 360° rotation
- **Title Glow**: Subtle text shadow animation
- **Loading Dots**: Pulsing dot indicators
- **Slide Up**: Content slides up on entry

## Customization

### Colors

The splash screen uses a gradient background. To customize colors, modify the CSS:

```css
.splash-screen {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Animations

All animations can be customized in `SplashScreen.css`. For users who prefer reduced motion, animations are automatically minimized.

### Duration Timing

The splash screen timing works as follows:
- **Fade-in**: First 800ms
- **Display**: Middle duration
- **Fade-out**: Last 500ms

## Files Structure

```
src/
├── components/
│   ├── SplashScreen.tsx     # Main component
│   ├── SplashScreen.css     # Styles and animations
│   ├── Login.tsx            # Login component (redirect target)
│   ├── Login.css           # Login styles
│   └── index.ts            # Component exports
├── hooks/
│   └── useSplash.ts        # Splash timing hook
└── App.tsx                 # Main app with state management
```

## Dependencies

- React 19+
- TypeScript
- CSS3 (for animations)

## Browser Support

- Modern browsers with CSS3 animation support
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion` setting

## License

Part of the Kodotakai application.
