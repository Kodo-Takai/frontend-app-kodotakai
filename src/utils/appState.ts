// App state management utilities

export const APP_STATES = {
  SPLASH: 'splash',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  LOADING: 'loading'
} as const;

export type AppState = typeof APP_STATES[keyof typeof APP_STATES];

// State transition helpers
export const getNextState = (currentState: AppState): AppState => {
  switch (currentState) {
    case APP_STATES.SPLASH:
      return APP_STATES.LOGIN;
    case APP_STATES.LOGIN:
      return APP_STATES.DASHBOARD;
    default:
      return currentState;
  }
};

// State validation
export const isValidState = (state: string): state is AppState => {
  return Object.values(APP_STATES).includes(state as AppState);
};

// Local storage helpers for persisting state
export const STORAGE_KEYS = {
  SPLASH_SHOWN: 'kodotakai_splash_shown',
  USER_SESSION: 'kodotakai_user_session'
} as const;

export const shouldShowSplash = (): boolean => {
  // Show splash on first visit or after clearing storage
  const splashShown = localStorage.getItem(STORAGE_KEYS.SPLASH_SHOWN);
  return !splashShown;
};

export const markSplashShown = (): void => {
  localStorage.setItem(STORAGE_KEYS.SPLASH_SHOWN, 'true');
};

export const resetSplashState = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SPLASH_SHOWN);
};
