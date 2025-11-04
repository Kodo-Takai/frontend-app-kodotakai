import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterFlowContext } from "../context/useRegisterFlowContext";
import { useRegisterFlow } from "../hooks/auth/useRegisterFlow";
import { useToast } from "../hooks/useToast";

export default function TravelPreferences() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { updateSelections } = useRegisterFlowContext();
  const { completeAndSubmit } = useRegisterFlow();
  const { success: toastSuccess, error: toastError } = useToast();

  const travelerTypes = ["Económico", "Medio", "Premium"];

  const travelingDescription = [
    "Lo importante es vivir la experiencia",
    "Un punto justo entre precio y confort",
    "Me gusta viajar sin límites",
  ];

  const travelTime = [
    "Caminando",
    "En bicicleta",
    "En auto",
    "En transporte público",
  ];

  const toggleType = (type: string) => {
    const budgetSet = new Set(travelerTypes);
    const transportSet = new Set(travelTime);
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);
      // Presupuesto: exactamente 1 (radio-like)
      if (budgetSet.has(type)) {
        const withoutBudget = prev.filter((t) => !budgetSet.has(t));
        if (isSelected) return prev; // no quitar para mantener selección única
        return [...withoutBudget, type];
      }
      // Transporte: min 1, max 2
      if (transportSet.has(type)) {
        const current = prev.filter((t) => transportSet.has(t));
        if (isSelected) {
          return prev.filter((t) => t !== type);
        }
        if (current.length >= 2) return prev; // máximo 2
        return [...prev, type];
      }
      return prev;
    });
  };

  // Validación
  const budgetSet = new Set(travelerTypes);
  const transportSet = new Set(travelTime);
  const budgetCount = selectedTypes.filter((t) => budgetSet.has(t)).length;
  const transportCount = selectedTypes.filter((t) =>
    transportSet.has(t)
  ).length;
  const budgetValid = budgetCount === 1;
  const transportValid = transportCount >= 1 && transportCount <= 2;
  const isFormValid = budgetValid && transportValid;
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
          style={{ backgroundColor: "var(--color-green)" }}
        >
          {" "}
        </div>
        <div
          className="px-13 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-green)" }}
        ></div>
      </div>
      <div className="mt-6">
        <div className="">
          <span
            className="text-lg font-extrabold"
            style={{ color: "var(--color-blue)" }}
          >
            ¡Últimos detalles para personalizar tu viaje!
          </span>
          <p
            className="text-sm mb-6 mt-2"
            style={{ color: "var(--color-blue)" }}
          >
            Cuéntanos cómo quieres vivir tu experiencia.
          </p>
        </div>
        <div className="space-y-8">
          <div>
            <span
              className="font-bold text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Cuando viajas, prefieres...
            </span>
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--color-blue-light)" }}
            >
              (elige 1)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelerTypes.map((type, index) => {
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
              className="font-medium text-[16px]"
              style={{ color: "var(--color-blue)" }}
            >
              Y moverte...
            </span>
            <span
              className="ml-2 text-xs"
              style={{ color: "var(--color-blue-light)" }}
            >
              (elige de 1 a 2)
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {travelTime.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className="animate-bubble-in px-4 py-1.5 rounded-xl cursor-pointer text-[14px] transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
        onClick={async () => {
          const budgetSet = new Set(travelerTypes);
          const transportSet = new Set(travelTime);
          const budget = selectedTypes.filter((t) => budgetSet.has(t)) as (
            | "Económico"
            | "Medio"
            | "Premium"
          )[];
          const transport = selectedTypes.filter((t) =>
            transportSet.has(t)
          ) as (
            | "Caminando"
            | "En bicicleta"
            | "En auto"
            | "En transporte público"
          )[];
          // Ensure final choices are included in the submit payload
          updateSelections({ budget, transport });

          const res = await completeAndSubmit({ budget, transport });
          if (res.success) {
            toastSuccess("Registro completado y preferencias guardadas");
          } else {
            toastError(res.error || "No se pudo completar el registro");
          }
        }}
      >
        Continuar
      </button>
    </section>
  );
}
