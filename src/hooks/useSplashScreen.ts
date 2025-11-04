import { useEffect, useState } from "react";
import { SPLASH_CONFIGS } from "../config/splashConfig";

export function useSplashScreen(configKey: keyof typeof SPLASH_CONFIGS = "standard") {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const config = SPLASH_CONFIGS[configKey];

    // Espera a que las fuentes estén listas y simula una verificación de autenticación
    const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const waitAuth = Promise.resolve();
    const splashDelay = new Promise((res) => setTimeout(res, config.duration));

    Promise.all([waitFonts, waitAuth, splashDelay]).finally(() => setReady(true));
  }, [configKey]);

  return ready;
}
