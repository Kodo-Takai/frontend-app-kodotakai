import { useMapImageByCoords } from "../../hooks/places";

type Props = {
  lat: number;
  lng: number;
};

export function MapImageExample({ lat, lng }: Props) {
  const { imageUrl, loading, error, source } = useMapImageByCoords(lat, lng, {
    size: "600x300",
    zoom: 17,
    markerColor: "blue",
    preferStreetView: true,
    streetView: { fov: 90, pitch: 0 },
  });

  if (loading) return <div>Cargando imagen del mapa…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!imageUrl) return <div>Sin ubicación</div>;

  return (
    <figure style={{ display: "inline-block" }}>
      <img
        src={imageUrl}
        alt={`Vista ${source === "streetview" ? "Street View" : "Mapa"}`}
        style={{ borderRadius: 8, maxWidth: "100%" }}
      />
      <figcaption style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        Fuente: {source}
      </figcaption>
    </figure>
  );
}
