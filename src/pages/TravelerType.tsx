import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TravelerType() {
  const navigate = useNavigate();
  return (
    <section
      className="max-w-md mx-auto p-6 rounded-lg justify-center"
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

      <p
        className="text-sm mb-6 font-medium"
        style={{ color: "var(--color-blue-light)" }}
      >
        Cuéntanos un poco sobre ti para hacer que tus aventuras sean
        inolvidables, solo tomará un minuto
      </p>
    </section>
  );
}
