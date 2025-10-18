import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterFlowContext } from "../context/useRegisterFlowContext";
import { useRegisterFlow } from "../hooks/auth/useRegisterFlow";

export default function TravelActivities() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { updateSelections } = useRegisterFlowContext();
  const { goPreferences } = useRegisterFlow();

  const travelerTimes = [
    "Hacer senderismo",
    "Relajarte en la playa",
    "Probar comida típica",
    "Salir de fiesta o bares",
    "Vivir aventuras o deportes extremos",
    "Conectar con la naturaleza",
    "Ir a eventos locales",
  ];

  const travelingLocal = [
    "Urbanos",
    "De playa",
    "De montaña",
    "Naturales",
    "Con encanto",
  ];

  const toggleType = (type: string) => {
    const activitiesSet = new Set(travelerTimes);
    const placeTypesSet = new Set(travelingLocal);
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);
      if (activitiesSet.has(type)) {
        const current = prev.filter((t) => activitiesSet.has(t));
        if (isSelected) {
          return prev.filter((t) => t !== type);
        }
        if (current.length >= 5) return prev; // max 5
        return [...prev, type];
      }
      if (placeTypesSet.has(type)) {
        const current = prev.filter((t) => placeTypesSet.has(t));
        if (isSelected) {
          return prev.filter((t) => t !== type);
        }
        if (current.length >= 3) return prev; // max 3
        return [...prev, type];
      }
      return prev;
    });
  };

  // Validación
  const activitiesSet = new Set(travelerTimes);
  const placeTypesSet = new Set(travelingLocal);
  const activitiesCount = selectedTypes.filter((t) => activitiesSet.has(t)).length;
  const placeTypesCount = selectedTypes.filter((t) => placeTypesSet.has(t)).length;
  const activitiesValid = activitiesCount >= 2 && activitiesCount <= 5;
  const placeTypesValid = placeTypesCount >= 1 && placeTypesCount <= 3;
  const isFormValid = activitiesValid && placeTypesValid;
  return (
    <section
      className="mx-auto p-6 rounded-lg justify-center"
      style={{ backgroundColor: "var(--color-bone)" }}
    >
      <div
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        aria-label="Regresar"
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{
            backgroundColor: "var(--color-blue)",
            color: "var(--color-bone)",
          }}
        >
          <FaArrowLeft className="w-4 h-4" />
        </div>
      </div>

      <h2
        className="text-[40px] font-extrabold mb-4 mt-4 font-sf-pro tracking-tight leading-10"
        style={{ color: "var(--color-blue)" }}
      >
        ¡Hagamos que tu viaje sea{" "}
        <span style={{ color: "var(--color-green)" }}>perfecto</span>
      </h2>

      <p className="text-sm mb-6" style={{ color: "var(--color-blue-light)" }}>
        Cuéntanos un poco sobre ti para hacer que tus aventuras sean
        inolvidables, solo tomará un minuto
      </p>
      <div className="flex gap-2 mt-10">
        <div
          className="px-6.5 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-green)" }}
        ></div>
        <div
          className="px-6.5 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          {" "}
        </div>
        <div
          className="px-6.5 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-beige)" }}
        ></div>
      </div>
      <div className="mt-6">
        <div className="">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-blue)" }}
          >
            ¿Qué te gusta hacer cuando viajas?
          </span>
          <p
            className="text-sm mb-6 font-medium"
            style={{ color: "var(--color-blue-light)" }}
          >
            Marca todo lo que te llame la atención, ¡no hay límites!
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <span
              className="font-medium text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Te encanta cuando puedes...
            </span>
            <span className="ml-2 text-xs" style={{ color: "var(--color-blue-light)" }}>(elige de 2 a 5)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelerTimes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className="px-4 py-1.5 rounded-xl cursor-pointer text-[14px]"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--color-green-light)"
                        : "var(--color-beige-light)",
                      border: `1px solid ${
                        isSelected
                          ? "var(--color-green-dark)"
                          : "var(--color-beige-dark)"
                      }`,
                      color: "var(--color-blue)",
                    }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <span
              className="font-medium text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Te atraen más los lugares...
            </span>
            <span className="ml-2 text-xs" style={{ color: "var(--color-blue-light)" }}>(elige de 1 a 3)</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelingLocal.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className="px-4 py-1.5 rounded-xl cursor-pointer text-[14px]"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--color-green-light)"
                        : "var(--color-beige-light)",
                      border: `1px solid ${
                        isSelected
                          ? "var(--color-green-dark)"
                          : "var(--color-beige-dark)"
                      }`,
                      color: "var(--color-blue)",
                    }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <button
        className="w-full py-3 rounded-2xl mt-7 font-medium"
        style={{
          backgroundColor: "var(--color-green)",
          color: "var(--color-blue)",
          border: "1px solid var(--color-green-dark)",
          opacity: isFormValid ? 1 : 0.6,
          cursor: isFormValid ? "pointer" : "not-allowed",
        }}
        disabled={!isFormValid}
        onClick={() => {
          const activitiesSet = new Set(travelerTimes);
          const placeTypesSet = new Set(travelingLocal);
          const activities = selectedTypes.filter((t) => activitiesSet.has(t));
          const placeTypes = selectedTypes.filter((t) => placeTypesSet.has(t));
          updateSelections({ activities, placeTypes });
          goPreferences();
        }}
      >
        Continuar
      </button>
    </section>
  );
}
