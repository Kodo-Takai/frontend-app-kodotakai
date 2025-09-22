import MapsCard from "../mapsCard";
import WeatherCard from "../weatherCard";
import CalendarCard from "../calendarCard";

export default function SummaryCard() {
 return (
    <div className="w-full">
      <h1 className="text-lg font-bold mb-4">Resumen de Hoy</h1>
      <div className="grid grid-cols-5 gap-2 h-32"> 
        <div className="col-span-3 h-full"> 
          <MapsCard className="w-full h-full" />
        </div>
        <div className="col-span-2 flex flex-col gap-2 h-full">
          <div className="flex-[3]">
            <WeatherCard className="w-full h-full" />
          </div>
          <div className="flex-[2]">
            <CalendarCard />
          </div>
        </div>
      </div>
    </div>
  );
}
