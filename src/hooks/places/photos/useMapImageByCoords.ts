import { useEffect, useMemo, useState } from "react";

type MapType = "roadmap" | "satellite" | "terrain" | "hybrid";

export type StreetViewOptions = {
    size?: string; // e.g. "600x400"
    fov?: number; // 0-120, default 80
    heading?: number; // 0-360
    pitch?: number; // -90 to 90
};

export type MapImageOptions = {
    size?: string; // e.g. "600x400"
    zoom?: number; // e.g. 16
    markerColor?: string; // e.g. "red"
    mapType?: MapType; // default "roadmap"
    preferStreetView?: boolean; // default true
    streetView?: StreetViewOptions;
};

export type MapImageSource = "streetview" | "staticmap" | null;

/**
 * Hook: useMapImageByCoords
 * Dado un par (lat, lng), devuelve una URL de imagen de Google Maps.
 * Si hay Street View disponible para esa ubicación (y preferStreetView=true),
 * retorna la imagen de Street View; si no, retorna un Static Map con marcador.
 */
export function useMapImageByCoords(
    lat?: number | null,
    lng?: number | null,
    options?: MapImageOptions
) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [source, setSource] = useState<MapImageSource>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY as
        | string
        | undefined;

    // Crear una clave estable para las opciones
    const optionsKey = useMemo(() => {
        return JSON.stringify(options || {});
    }, [options]);

    const opts = useMemo<MapImageOptions>(() => {
        return {
            size: "600x400",
            zoom: 16,
            markerColor: "red",
            mapType: "roadmap",
            preferStreetView: true,
            ...options,
            streetView: {
                fov: 80,
                ...(options?.streetView || {}),
            },
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey]);

    useEffect(() => {
        if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
            setImageUrl(null);
            setSource(null);
            setError(null);
            return;
        }

        if (!apiKey) {
            setError(
                "Falta la API Key de Google Maps (VITE_REACT_APP_GOOGLE_MAPS_API_KEY)."
            );
            setImageUrl(null);
            setSource(null);
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const buildStaticMapUrl = () => {
            const params = new URLSearchParams({
                center: `${lat},${lng}`,
                zoom: String(opts.zoom),
                size: opts.size!,
                maptype: opts.mapType!,
                key: apiKey,
            });
            params.append("markers", `color:${opts.markerColor}|${lat},${lng}`);
            return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
        };

        const buildStreetViewUrl = () => {
            const sv = opts.streetView || {};
            const params = new URLSearchParams({
                size: sv.size || opts.size!,
                location: `${lat},${lng}`,
                key: apiKey,
                fov: String(sv.fov ?? 80),
            });
            if (sv.heading != null) params.set("heading", String(sv.heading));
            if (sv.pitch != null) params.set("pitch", String(sv.pitch));
            return `https://maps.googleapis.com/maps/api/streetview?${params.toString()}`;
        };

        const checkStreetViewAndSet = async () => {
            setLoading(true);
            setError(null);

            try {
                if (opts.preferStreetView) {
                    const metaUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${apiKey}`;
                    const res = await fetch(metaUrl, { signal: controller.signal });
                    const meta = await res.json();

                    if (!cancelled && meta?.status === "OK") {
                        setImageUrl(buildStreetViewUrl());
                        setSource("streetview");
                        setLoading(false);
                        return;
                    }
                }
            } catch {
                // Ignorar errores de red y hacer fallback
            }

            if (!cancelled) {
                setImageUrl(buildStaticMapUrl());
                setSource("staticmap");
                setLoading(false);
            }
        };

        checkStreetViewAndSet();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [lat, lng, apiKey, opts]);

    return { imageUrl, loading, error, source } as const;
}
