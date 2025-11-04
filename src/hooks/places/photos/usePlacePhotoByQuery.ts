import { useEffect, useMemo, useState } from "react";
import { loadGoogleMaps } from "../base/useGoogleMaps";

type Options = {
    maxWidth?: number;
    maxHeight?: number;
};

const photoCache = new Map<string, string | null>();

/**
 * Dado un query (ej. "La Mansión Campestre Lima"), busca el lugar en Google Places
 * y devuelve la URL de la primera foto disponible. Usa caché en memoria.
 */
export function usePlacePhotoByQuery(query?: string | null, options?: Options) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const opts = useMemo(() => ({ maxWidth: 800, maxHeight: 320, ...(options || {}) }), [options]);
    const q = (query || "").trim();

    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (!q) {
                setUrl(null);
                setError(null);
                return;
            }

            // caché
            if (photoCache.has(q)) {
                setUrl(photoCache.get(q) ?? null);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);
            setUrl(null);

            try {
                await loadGoogleMaps();

                const phantom = document.createElement("div");
                phantom.style.width = "0";
                phantom.style.height = "0";
                phantom.style.overflow = "hidden";
                document.body.appendChild(phantom);

                const map = new window.google.maps.Map(phantom, {
                    center: { lat: 0, lng: 0 },
                    zoom: 12,
                });

                const service = new window.google.maps.places.PlacesService(map);

                const results: google.maps.places.PlaceResult[] = await new Promise((resolve) => {
                    service.textSearch({ query: q }, (res, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && res) {
                            resolve(res);
                        } else {
                            resolve([]);
                        }
                    });
                });

                document.body.removeChild(phantom);

                const first = results[0];
                const photoUrl = first?.photos?.[0]?.getUrl?.({ maxWidth: opts.maxWidth, maxHeight: opts.maxHeight }) || null;

                if (!cancelled) {
                    photoCache.set(q, photoUrl);
                    setUrl(photoUrl);
                    setLoading(false);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setLoading(false);
                    setUrl(null);
                    const message = err instanceof Error ? err.message : "No se pudo obtener la foto del lugar";
                    setError(message);
                }
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [q, opts.maxWidth, opts.maxHeight]);

    return { url, loading, error } as const;
}
