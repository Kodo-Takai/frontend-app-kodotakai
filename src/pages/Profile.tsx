import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { useProfile } from "../hooks/useProfile";
import PageWrapper from "../components/layout/SmoothPageWrapper";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProfile, isFetching } = useProfile();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div
      className="min-h-screen relative pb-20"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <PageWrapper>
        <div className="w-full h-full flex flex-col items-center px-6">
          
          {/* Título - Espaciado personalizable */}
          <div className="flex items-center justify-between w-full mt-7 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-[15px] font-bold leading-[22px] text-[var(--color-text-primary)]">
                Tu
              </h1>
              <p className="h-10 overflow-hidden whitespace-nowrap text-ellipsis max-w-full text-[40px] font-extrabold leading-[26px] tracking-[-0.9px] text-[var(--color-text-primary)]">
                Perfil
              </p>
            </div>
          </div>

          {/* Foto de perfil - Espaciado personalizable */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-green)]">
              <img
                src={currentProfile?.photo || "/profilePic.webp"}
                className="w-full h-full object-cover"
                alt="Foto de perfil"
              />
            </div>
          </div>

          {/* Nombre completo - Espaciado personalizable */}
          <div className="text-center mb-3">
            {isFetching ? (
              <span className="text-2xl font-bold text-[var(--color-text-muted)]">
                Cargando...
              </span>
            ) : currentProfile ? (
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                {`${currentProfile.name || "Nombre"} ${currentProfile.lastName || "Apellidos"}`.trim()}
              </span>
            ) : (
              <span className="text-2xl font-bold text-[var(--color-text-muted)]">
                Usuario Anónimo
              </span>
            )}
          </div>

          {/* Email - Espaciado personalizable */}
          <div className="text-center mb-8">
            {currentProfile?.email ? (
              <p className="text-lg opacity-70 text-[var(--color-text-primary)]">
                {currentProfile.email}
              </p>
            ) : (
              <p className="text-lg opacity-70 text-[var(--color-text-muted)]">
                No hay email disponible
              </p>
            )}
          </div>

          {/* Tarjetas de estadísticas - Espaciado personalizable */}
          <div className="w-full flex gap-4 mb-8">
            {/* Tarjeta Destinos visitados */}
            <div className="flex-1 bg-[var(--color-green)] rounded-xl p-4 flex flex-col items-center justify-center">
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="var(--color-text-primary)"
                  />
                </svg>
              </div>
              <span className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
                Destinos visitados
              </span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                0
              </span>
            </div>

            {/* Tarjeta Se unió el */}
            <div className="flex-1 bg-[var(--color-green)] rounded-xl p-4 flex flex-col items-center justify-center">
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="var(--color-text-primary)"
                  />
                </svg>
              </div>
              <span className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
                Se unió el:
              </span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                00/00/0000
              </span>
            </div>
          </div>

          {/* Opciones de menú - Espaciado personalizable */}
          <div className="w-full space-y-4 mb-8">
            {/* Editar Perfil */}
            <button
              onClick={() => navigate("/custom-profile")}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:scale-105 transition-all duration-200 bg-[var(--color-btn-primary)]"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <path
                    d="M.625 13.094v3.281h3.281l9.678-9.678-3.281-3.28zM16.121 4.16a.87.87 0 0 0 0-1.234L14.074.88a.87.87 0 0 0-1.234 0l-1.601 1.6 3.281 3.281z"
                    fill="var(--color-text-white)"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg text-[var(--color-text-white)]">
                Editar Perfil
              </span>
              <div className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="var(--color-text-white)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {/* Ver Historial */}
            <button
              onClick={() => navigate("/agenda")}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:scale-105 transition-all duration-200 bg-[var(--color-btn-primary)]"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 6h18M3 12h18M3 18h18"
                    stroke="var(--color-text-white)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-lg text-[var(--color-text-white)]">
                Ver Historial
              </span>
              <div className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="var(--color-text-white)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Botón de cerrar sesión - Espaciado personalizable */}
          <div className="w-full flex justify-center">
            <button
              className="flex gap-4 items-center justify-center py-3 px-8 rounded-xl hover:scale-105 transition-all duration-200 bg-[var(--color-btn-neutral)] border border-[var(--color-text-primary)]"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="24"
                viewBox="0 0 17 24"
                fill="none"
                className="transition-all duration-300"
              >
                <path
                  d="M9.646.688c3.201-.478 4.802-.716 5.843.181 1.042.898 1.042 2.516 1.042 5.753v4.29H9.3l3.306-3.925-1.53-1.289-4.691 5.569-.543.644.543.645 4.691 5.567.765-.643.765-.645L9.3 12.911h7.232V17.2c0 3.237 0 4.856-1.042 5.753-1.041.898-2.642.659-5.843.18L3.52 22.22c-1.626-.243-2.44-.365-2.924-.927-.485-.563-.486-1.386-.486-3.03V5.558c0-1.644 0-2.467.486-3.03.485-.562 1.298-.684 2.924-.926z"
                  fill="var(--color-text-primary)"
                />
              </svg>
              <span className="font-bold text-[var(--color-text-primary)]">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}