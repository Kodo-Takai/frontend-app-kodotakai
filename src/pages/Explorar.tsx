import { useState } from "react";
import SegmentedControl from "../components/ui/segmentedControl";

export default function Explorar() {
  const [selectedOption, setSelectedOption] = useState("Todo");
  const options = ["Todo", "Sugerencias IA"];

  return (
    <div className="flex flex-col gap-3 max-w-md mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex flex-col gap-2.5">
          <h1
            style={{
              color: "#000",
              fontSize: "40px",
              fontStyle: "normal",
              fontWeight: "800",
              lineHeight: "26px",
            }}
          >
            Explorar
          </h1>
          <p
            style={{
              color: "#000",
              fontSize: "15px",
              fontStyle: "normal",
              fontWeight: "500",
              lineHeight: "22px",
            }}
          >
            A donde iremos hoy?
          </p>
        </div>

        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">K</span>
        </div>
      </div>

      <SegmentedControl
        options={["Todo", "Sugerencias IA"]}
        selected={selectedOption}
        onChange={setSelectedOption}
      />
    </div>
  );
}
