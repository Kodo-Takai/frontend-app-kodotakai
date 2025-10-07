import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../redux/store";
import { useGetProfilesQuery } from "../redux/api/profileApi";
import { logout } from "../redux/slice/authSlice";
import { decodeJwt } from "../utils/jwt";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const payload = useMemo(() => decodeJwt(token), [token]);
  const profileIdFromToken = payload?.profileId as string | undefined;

  const { data: profiles, isFetching } = useGetProfilesQuery();

  const currentProfile = useMemo(() => {
    if (!profiles || profiles.length === 0) return undefined;
    if (profileIdFromToken)
      return profiles.find((p) => p.id === profileIdFromToken);
    if (payload?.email) return profiles.find((p) => p.email === payload.email);
    return profiles[0];
  }, [profiles, profileIdFromToken, payload]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-[#F6F6F6] space-y-4">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[#322C2C] text-[28px] font-bold">Mi Perfil</h1>
        <div className="p-3 border-2 border-[#322C2C] rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
          >
            <path
              d="M16.936 11.768c-.192-1.34-.48-3.304-.77-4.732a7.6 7.6 0 0 0-.577-1.965C14.82 2.214 11.935.25 8.76.25c-3.27 0-6.157 1.964-6.927 4.732a63 63 0 0 1-.577 2.054c-.289 1.428-.577 3.393-.77 4.732-.192 1.25.77 2.41 2.117 2.678.962.179 2.213.268 3.463.447v.357c0 1.34 1.155 2.5 2.694 2.5 1.443 0 2.694-1.071 2.694-2.5v-.357c1.25-.09 2.405-.268 3.463-.447 1.25-.267 2.213-1.428 2.02-2.678M9.913 15.25c0 .625-.577 1.071-1.154 1.071s-1.25-.535-1.25-1.071v-.268h2.404z"
              fill="#322C2C"
            />
          </svg>
        </div>
      </div>
      <div className="w-full flex items-center gap-4 py-4">
        <div className="w-[85px] h-[85px]">
          <img
            src={currentProfile?.photo || "/profilePic.webp"}
            className="w-full h-full rounded-full object-cover"
            alt="Foto de perfil"
          />
        </div>
        <div className="flex flex-col">
          {isFetching ? (
            <div className="flex flex-col -space-y-2">
              <span className="text-2xl font-medium text-gray-400">
                Cargando...
              </span>
            </div>
          ) : currentProfile ? (
            <>
              <div className="flex flex-col -space-y-2">
                <span className="text-2xl font-medium">
                  {currentProfile.name || "Nombre"}
                </span>
                <span className="text-2xl font-medium">
                  {currentProfile.lastName || "Apellidos"}
                </span>
              </div>
              <p className="opacity-50">{currentProfile.email}</p>
            </>
          ) : (
            <>
              <div className="flex flex-col -space-y-2">
                <span className="text-2xl font-medium text-gray-400">
                  Usuario
                </span>
                <span className="text-2xl font-medium text-gray-400">
                  Anónimo
                </span>
              </div>
              <p className="opacity-50 text-gray-400">
                No hay perfil disponible
              </p>
            </>
          )}
        </div>
      </div>
      <div className="w-full space-y-5">
        <div className="w-full flex gap-2">
          <button
            onClick={() => navigate("/custom-profile")}
            className="bg-[#00324A] flex-none flex py-2 px-4 rounded-lg items-center gap-2 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M.625 13.094v3.281h3.281l9.678-9.678-3.281-3.28zM16.121 4.16a.87.87 0 0 0 0-1.234L14.074.88a.87.87 0 0 0-1.234 0l-1.601 1.6 3.281 3.281z"
                fill="#fff"
              />
            </svg>
            <span className="font-medium text-white">Editar Perfil</span>
          </button>
          <button className="bg-white border-1 border-[#DADADA] flex-1 flex py-2 px-4 rounded-lg items-center gap-2 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="21"
              viewBox="0 0 15 21"
              fill="none"
            >
              <path
                d="M14.375 8.865V.082H.625v8.782c0 .364.248.708.674.895l5.747 2.615-1.361 2.437-4.689.303 3.562 2.333-1.087 3.469L7.5 19.073l4.029 1.844-1.073-3.47 3.562-2.332-4.69-.303-1.36-2.437 5.747-2.615c.412-.187.66-.52.66-.896m-5.5 1.874-1.375.625-1.375-.625V1.125h2.75z"
                fill="#DC1217"
              />
            </svg>
            <span className="font-bold text-[#DC1217]">Lvl: Nuevo Usuario</span>
          </button>
        </div>
        <div className="flex w-full gap-4">
          <div className="bg-[#E8E8E8] w-full justify-center flex flex-col items-center py-4 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="21"
              viewBox="0 0 27 21"
              fill="none"
            >
              <path
                d="M23.913.833C22.618.425 21.195.25 19.83.25c-2.275 0-4.725.467-6.417 1.75C11.722.717 9.271.25 6.997.25S2.272.717.58 2v17.092c0 .291.292.583.583.583.117 0 .175-.058.292-.058 1.575-.759 3.85-1.284 5.542-1.284 2.274 0 4.725.467 6.416 1.75 1.575-.991 4.433-1.75 6.417-1.75 1.925 0 3.908.35 5.542 1.225.116.059.175.059.291.059.292 0 .584-.292.584-.584V2c-.7-.525-1.459-.875-2.334-1.167m0 15.75C22.63 16.175 21.23 16 19.83 16c-1.983 0-4.842.758-6.417 1.75V4.333c1.575-.991 4.433-1.75 6.417-1.75 1.4 0 2.8.175 4.083.584z"
                fill="#00324A"
              />
              <path
                d="M19.83 7.25c1.027 0 2.018.105 2.917.303V5.78a16 16 0 0 0-2.917-.28c-1.983 0-3.78.338-5.25.968v1.937c1.318-.747 3.15-1.155 5.25-1.155m-5.25 2.322v1.936c1.318-.746 3.15-1.155 5.25-1.155 1.027 0 2.018.105 2.917.304V8.883a16 16 0 0 0-2.917-.28c-1.983 0-3.78.35-5.25.969m5.25 2.146c-1.983 0-3.78.339-5.25.969v1.936c1.318-.746 3.15-1.155 5.25-1.155 1.027 0 2.018.105 2.917.304v-1.774a15 15 0 0 0-2.917-.28"
                fill="#00324A"
              />
            </svg>
            <span className="text-[#00324A] font-bold">Historial</span>
          </div>
          <div className="bg-[#E8E8E8] w-full justify-center flex flex-col items-center py-4 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="25"
              viewBox="0 0 16 25"
              fill="none"
            >
              <path
                d="M15.917 10.603V.417H.083v10.186c0 .423.285.822.776 1.04l6.619 3.032-1.568 2.828-5.399.35 4.1 2.707-1.25 4.023 4.64-2.138 4.638 2.138-1.235-4.023 4.101-2.707-5.399-.35-1.567-2.828 6.618-3.033c.475-.217.76-.604.76-1.039m-6.333 2.175L8 13.503l-1.583-.725V1.625h3.167z"
                fill="#00324A"
              />
            </svg>
            <span className="text-[#00324A] font-bold">Insignias</span>
          </div>
        </div>
        <div className="bg-white flex justify-center items-center w-full gap-4 py-2.5 px-4 rounded-xl">
          <div className="px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="24"
              viewBox="0 0 21 24"
              fill="none"
            >
              <path
                d="m10.43 16.488-.777-.178c-1.47-.336-2.755-1.509-3.366-3.15l-.207-.558-.59-.083-.207-.035C3.15 12.068 1.39 9.95 1.39 7.206V5.931c0-.374.102-.69.26-.938v2.213c0 2.03 1.164 3.822 2.881 4.524l1.378.563V4.931H1.692c.251-.355.62-.552.958-.552h3.26V1.827h9.3V4.38h3.259c.337 0 .707.197.959.552h-4.219v7.362l1.38-.563c1.716-.702 2.88-2.493 2.88-4.524V4.991c.158.248.26.565.26.94v1.275c0 2.833-1.876 4.998-4.1 5.313l-.59.083-.208.557c-.61 1.642-1.894 2.815-3.364 3.15l-.777.178v5.753h4.52v.551h-9.3v-.552h4.52z"
                stroke="#00324A"
                stroke-width="2"
              />
            </svg>
          </div>
          <div className="w-full space-y-1">
            <div>
              <span className="font-bold text-[#00324A]">
                Insignia Actual: Aventurero
              </span>
            </div>
            <div className="w-full bg-[#ECECEC] h-3 rounded-full overflow-hidden">
              <div className="w-[0%] bg-[#DC1217] h-full rounded-full transition-all duration-300"></div>
            </div>
            <div>
              <span className="font-semibold text-[#DC1217]">
                0 destinos visitados de 3
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12 justify-center mt-4">
        <div className="flex items-center gap-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
          >
            <path
              d="M9 .5c2.809 0 4.214 0 5.223.674a4 4 0 0 1 1.103 1.103C16 3.287 16 4.691 16 7.5s0 4.214-.674 5.223a4 4 0 0 1-1.103 1.103c-.882.59-2.065.663-4.223.672v.002l-1.105 2.21a1 1 0 0 1-1.79 0L6 14.5v-.002c-2.158-.01-3.341-.083-4.223-.672a4 4 0 0 1-1.103-1.103C0 11.713 0 10.309 0 7.5s0-4.214.674-5.223a4 4 0 0 1 1.103-1.103C2.787.5 4.191.5 7 .5zm-5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2m4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2m4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
              fill="#000"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-lg">Reviews</span>
            <span className="text-sm text-[#5C5C5C]">
              Revisa tus reseñas a los destinos que visitaste
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
          >
            <path
              d="m11.87 13.57-2.54-2.51.03-.03a17.5 17.5 0 0 0 3.71-6.53H16v-2H9v-2H7v2H0v1.99h11.17C10.5 6.42 9.44 8.25 8 9.85 7.07 8.82 6.3 7.69 5.69 6.5h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L3 17.5l5-5 3.11 3.11zM17.5 8.5h-2l-4.5 12h2l1.12-3h4.75l1.13 3h2zm-2.62 7 1.62-4.33 1.62 4.33z"
              fill="#000"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-bold text-lg">Idioma</span>
            <span className="text-sm text-[#5C5C5C]">
              Cambia el idioma a tu preferencia
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M10.053.75c.274 0 .411 0 .527.028.33.08.597.322.71.642.038.112.052.249.08.521.05.516.075.774.152.932a1 1 0 0 0 1.233.51c.166-.058.366-.222.768-.55.213-.174.32-.26.427-.312a1 1 0 0 1 .953.047c.102.063.2.16.394.354l.781.781c.194.194.291.29.354.393.176.29.194.65.047.955-.052.107-.14.214-.313.426-.328.4-.492.601-.55.767a1 1 0 0 0 .51 1.233c.159.076.416.102.933.154.273.027.41.04.522.08a1 1 0 0 1 .64.708c.029.116.029.254.029.528v1.106c0 .274 0 .411-.028.527a1 1 0 0 1-.64.71c-.114.039-.25.052-.523.08-.516.05-.774.077-.932.153a1 1 0 0 0-.51 1.233c.058.166.222.366.55.767.173.211.26.318.311.425a1 1 0 0 1-.046.955c-.062.102-.16.199-.354.393l-.781.781c-.194.194-.292.291-.394.354a1 1 0 0 1-.953.047c-.107-.051-.214-.138-.427-.312-.401-.329-.602-.494-.768-.552a1 1 0 0 0-1.232.511c-.077.159-.102.417-.154.934-.027.273-.041.41-.08.522a1 1 0 0 1-.709.64c-.116.029-.253.029-.527.029H8.947c-.274 0-.412 0-.528-.028a1 1 0 0 1-.708-.64c-.04-.114-.053-.25-.08-.523-.052-.516-.078-.774-.154-.933a1 1 0 0 0-1.233-.51c-.166.059-.366.223-.767.551-.213.174-.32.26-.427.313a1 1 0 0 1-.953-.048c-.102-.062-.2-.16-.394-.354l-.781-.781c-.194-.194-.291-.292-.354-.394a1 1 0 0 1-.047-.953c.051-.107.138-.214.312-.427.328-.402.492-.602.55-.768a1 1 0 0 0-.51-1.234c-.158-.076-.416-.1-.932-.152-.272-.027-.409-.04-.521-.08a1 1 0 0 1-.642-.709c-.028-.116-.028-.253-.028-.527V8.947c0-.274 0-.412.028-.528a1 1 0 0 1 .64-.708c.114-.04.25-.053.523-.08.516-.052.774-.078.933-.154a1 1 0 0 0 .51-1.233c-.059-.166-.223-.366-.551-.767-.174-.213-.26-.32-.312-.427a1 1 0 0 1 .047-.953c.063-.102.16-.2.354-.394l.781-.781c.194-.194.292-.291.394-.354a1 1 0 0 1 .953-.047c.107.051.214.138.427.312.4.328.601.492.767.55a1 1 0 0 0 1.233-.509c.076-.159.102-.417.154-.933.027-.273.04-.41.08-.522a1 1 0 0 1 .708-.64C8.535.75 8.673.75 8.947.75zM9.5 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7"
              fill="#000"
            />
          </svg>
          <span className="font-bold text-lg">Configuración</span>
        </div>
      </div>
      <div className="flex justify-end w-full mt-4">
        <button
          className="flex gap-4 items-center justify-center py-3 px-8 rounded-xl bg-white"
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
              fill="#DC1217"
            />
          </svg>
          <span className="font-bold text-[#DC1217]">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
