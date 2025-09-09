import { useEffect, useState } from "react";

export function useSplashScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Espera a que las fuentes estén listas y simula una verificación de autenticación
    const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const waitAuth = Promise.resolve(); 
    const minDelay = new Promise(res => setTimeout(res, 3000)); // sensación suave

    Promise.all([waitFonts, waitAuth, minDelay]).finally(() => setReady(true));
  }, []);

  return ready;
}
