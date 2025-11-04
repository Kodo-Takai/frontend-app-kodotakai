import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterFlowContext } from "../context/useRegisterFlowContext";
import { useRegisterFlow } from "../hooks/auth/useRegisterFlow";

export default function TravelerType() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { updateSelections } = useRegisterFlowContext();
  const { goActivities } = useRegisterFlow();

  const travelerTypes = [
    "Relax",
    "Cultural",
    "Nocturno",
    "Ecológico/a",
    "Fotógrafo",
    "Aventurero",
    "Gastronómico",
  ];

  const travelingTypes = ["Solo/a", "En pareja", "En familia", "Con amigos"];
  const travelingDescription = [
    "Mi propio guía y compañía",
    "Dos almas, una aventura",
    "Momentos para recordar juntos",
    "Donde vamos, la pasamos bien",
  ];

  const travelTime = ["1 día", "Fin de semana", "3 a 5 días", "1 semana o más"];

  const toggleType = (type: string) => {
    const travelerTypesSet = new Set(travelerTypes);
    const travelingTypesSet = new Set(travelingTypes);
    const travelTimeSet = new Set(travelTime);

    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);

      // Grupo: Eres un viajero... (min 1, max 3)
      if (travelerTypesSet.has(type)) {
        const currentGroup = prev.filter((t) => travelerTypesSet.has(t));
        if (isSelected) {
          // Quitar si ya estaba seleccionado
          return prev.filter((t) => t !== type);
        }
        if (currentGroup.length >= 3) {
          // No permitir más de 3
          return prev;
        }
        return [...prev, type];
      }

      // Grupo: Viajas normalmente... (exactamente 1)
      if (travelingTypesSet.has(type)) {
        const withoutGroup = prev.filter((t) => !travelingTypesSet.has(t));
        // Selección exclusiva (similar a radio button); mantener si ya estaba
        if (isSelected) return prev;
        return [...withoutGroup, type];
      }

      // Grupo: Tus viajes suelen durar... (exactamente 1)
      if (travelTimeSet.has(type)) {
        const withoutGroup = prev.filter((t) => !travelTimeSet.has(t));
        if (isSelected) return prev;
        return [...withoutGroup, type];
      }

      return prev;
    });
  };

  // Validación por grupo
  const travelerTypesSet = new Set(travelerTypes);
  const travelingTypesSet = new Set(travelingTypes);
  const travelTimeSet = new Set(travelTime);
  const travelerTypesCount = selectedTypes.filter((t) =>
    travelerTypesSet.has(t)
  ).length;
  const travelingTypesCount = selectedTypes.filter((t) =>
    travelingTypesSet.has(t)
  ).length;
  const travelTimeCount = selectedTypes.filter((t) =>
    travelTimeSet.has(t)
  ).length;
  const travelerTypesValid = travelerTypesCount >= 1 && travelerTypesCount <= 3;
  const travelingTypesValid = travelingTypesCount === 1;
  const travelTimeValid = travelTimeCount === 1;
  const isFormValid =
    travelerTypesValid && travelingTypesValid && travelTimeValid;

  return (
    <section
      className="mx-auto mt-5 p-6 rounded-lg justify-center"
      style={{ backgroundColor: "var(--color-bone)" }}
    >

      <h2
        className="text-[40px] font-extrabold mb-4 mt-4 font-sf-pro tracking-tight leading-10"
        style={{ color: "var(--color-blue)" }}
      >
        ¡Hagamos que tu viaje sea{" "}
        <span style={{ color: "var(--color-green)" }}>perfecto</span>
      </h2>

      <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-blue)" }}>
        Cuéntanos un poco sobre ti para hacer que tus aventuras sean
        inolvidables, solo tomará un minuto
      </p>
      <div className="flex gap-2 mt-5 justify-center">
        <div
          className="px-13 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-green)" }}
        ></div>
        <div
          className="px-13 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-beige)" }}
        >
          {" "}
        </div>
        <div
          className="px-13 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-beige)" }}
        ></div>
      </div>
      <div className="mt-6">
        <div className="">
          <span
            className="text-lg font-extrabold"
            style={{ color: "var(--color-blue)" }}
          >
            ¡Cuéntanos un poco sobre ti viajando!
          </span>
          <p
            className="text-sm mb-6 mt-2"
            style={{ color: "var(--color-blue)" }}
          >
            Así sabremos qué tipo de experiencias te harán feliz
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <span
              className="font-bold text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Eres un viajero...
            </span>
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--color-blue-light)" }}
            >
              (elige de 1 a 3)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelerTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                   <div
                     key={type}
                     onClick={() => toggleType(type)}
                     className="animate-bubble-in px-4 py-1.5 rounded-xl cursor-pointer text-[14px] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
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
              className="font-bold text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Viajas normalmente...
            </span>
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--color-blue-light)" }}
            >
              (elige 1)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelingTypes.map((type, index) => {
                const isSelected = selectedTypes.includes(type);
                return (
                   <div
                     key={type}
                     onClick={() => toggleType(type)}
                     className="animate-bubble-in w-full px-4 py-1.5 rounded-xl cursor-pointer text-[14px] transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
                    {type} -{" "}
                    <span style={{ color: "var(--color-blue-light)" }}>
                      {travelingDescription[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <span
              className="font-bold text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Tus viajes suelen durar...
            </span>
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--color-blue-light)" }}
            >
              (elige 1)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelTime.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                   <div
                     key={type}
                     onClick={() => toggleType(type)}
                     className="animate-bubble-in w-full px-4 py-1.5 rounded-xl cursor-pointer text-[14px] transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
         className="w-full py-3 rounded-2xl mt-7 font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
         style={{
           backgroundColor: "var(--color-green)",
           color: "var(--color-blue)",
           border: "1px solid var(--color-green-dark)",
           opacity: isFormValid ? 1 : 0.6,
           cursor: isFormValid ? "pointer" : "not-allowed",
         }}
         disabled={!isFormValid}
        onClick={() => {
          // Split selectedTypes into the three groups based on available options
          const travelerTypesSet = new Set(travelerTypes);
          const travelingTypesSet = new Set(travelingTypes);
          const travelTimeSet = new Set(travelTime);

          const travelerTypesSelected = selectedTypes.filter((t) =>
            travelerTypesSet.has(t)
          );
          const travelingWithSelected = selectedTypes.filter((t) =>
            travelingTypesSet.has(t)
          );
          const travelDurationSelected = selectedTypes.filter((t) =>
            travelTimeSet.has(t)
          );

          updateSelections({
            travelerTypes: travelerTypesSelected,
            travelingWith: travelingWithSelected,
            travelDuration: travelDurationSelected,
          });
          goActivities();
        }}
      >
        Continuar
      </button>
    </section>
  );
}
