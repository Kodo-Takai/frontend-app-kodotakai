// Professional splash screen configurations

export const SPLASH_CONFIGS = {
  // Quick professional splash (2 seconds)
  quick: {
    duration: 2000,
    logo: '/kodotakai-logo.svg',
    appName: 'Kodotakai'
  },

  // Standard professional splash (3 seconds) - Default
  standard: {
    duration: 3000,
    logo: '/kodotakai-logo.svg',
    appName: 'Kodotakai'
  },

  // Extended professional splash (4 seconds)
  extended: {
    duration: 4000,
    logo: '/kodotakai-logo.svg',
    appName: 'Kodotakai'
  },

  // Enterprise branding
  enterprise: {
    duration: 3000,
    logo: '/kodotakai-logo.svg',
    appName: 'Kodotakai Enterprise'
  },

  // Minimal configuration
  minimal: {
    duration: 2500,
    logo: '/kodotakai-logo.svg',
    appName: 'Kodotakai'
  }
};

// Usage example:
// <SplashScreen {...SPLASH_CONFIGS.enterprise} onComplete={handleComplete} />
