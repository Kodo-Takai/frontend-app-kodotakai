import { useState } from "react";
import BackButton from "../components/ui/backButton";
import SegmentedControl from "../components/ui/segmentedControl";
import SectionHeader from "../components/ui/sectionHeader";
import NotificationCard from "../components/ui/notificationCard";

export default function Notifications() {
  const [selected, setSelected] = useState("Todo");

  const notifications = {
    recientes: [
      {
        title: "Reserva confirmada",
        description: "¡Tu reserva en Bogotá ha sido confirmada!",
        isRead: false,
        imageUrl: "",
      },
      {
        title: "Reserva confirmada",
        description: "¡Tu reserva en Bogotá ha sido confirmada!",
        isRead: false,
        imageUrl: "",
      },
      {
        title: "Reserva confirmada",
        description: "¡Tu reserva en Bogotá ha sido confirmada!",
        isRead: false,
        imageUrl: "",
      },
    ],
    semana: [
      {
        title: "Nuevo destino agregado",
        description: "Explora Colombia en la app",
        isRead: true,
        imageUrl: "",
      },
      {
        title: "Nuevo destino agregado",
        description: "Explora Colombia en la app",
        isRead: true,
        imageUrl: "",
      },
      {
        title: "Nuevo destino agregado",
        description: "Explora Colombia en la app",
        isRead: true,
        imageUrl: "",
      },
    ],
    pasada: [
      {
        title: "Recordatorio de viaje",
        description: "¡Tienes un viaje programado en 2 días!",
        isRead: true,
        imageUrl: "",
      },
      {
        title: "Recordatorio de viaje",
        description: "¡Tienes un viaje programado en 2 días!",
        isRead: true,
        imageUrl: "",
      },
      {
        title: "Recordatorio de viaje",
        description: "¡Tienes un viaje programado en 2 días!",
        isRead: true,
        imageUrl: "",
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="space-y-5 mb-4">
        <BackButton />
        <h2 className="text-[2rem] font-extrabold">Notificaciones</h2>
      </div>

      <SegmentedControl
        options={["Todo", "Reservas", "Destinos"]}
        selected={selected}
        onChange={setSelected}
      />

      <div className="mt-2 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] max-h-[70vh] px-1">
        <SectionHeader title="Recientes" />
        {notifications.recientes.map((n, i) => (
          <NotificationCard key={i} {...n} />
        ))}

        <SectionHeader title="Esta semana" />
        {notifications.semana.map((n, i) => (
          <NotificationCard key={i} {...n} />
        ))}

        <SectionHeader title="La semana pasada" />
        {notifications.pasada.map((n, i) => (
          <NotificationCard key={i} {...n} />
        ))}
      </div>
    </div>
  );
}
