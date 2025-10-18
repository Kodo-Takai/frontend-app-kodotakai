import MapsCard from "../mapsCard";
import WeatherCard from "../weatherCard";
import CalendarCard from "../calendarCard";

export default function SummaryCard() {
  return (
    <div className="w-full h-57 mb-3">
      <h1 className="text-lg font-extrabold mb-2 text-[var(--color-text-primary)]">
        Resumen de Hoy
      </h1>
      <div className="grid grid-cols-5 gap-2 h-32">
        <div className="col-span-3 h-full">
          <MapsCard className="w-full h-full" />
        </div>
        <div className="col-span-2 flex flex-col gap-5 h-full">
          <div className="flex-[3]">
            <WeatherCard className="w-full h-full" />
          </div>
          <div className="flex-[2] relative z-20">
            <CalendarCard />
          </div>
        </div>
      </div>
    </div>
  );
}
