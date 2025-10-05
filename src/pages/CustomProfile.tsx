import Input from "../components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  useGetProfilesQuery,
  useUpdateProfileMutation,
} from "../redux/api/profileApi";
import { decodeJwt } from "../utils/jwt";

export default function CustomProfile() {
  // Auth token from store
  const token = useSelector((s: RootState) => s.auth.token);
  const payload = useMemo(() => decodeJwt(token), [token]);
  const profileIdFromToken = payload?.profileId as string | undefined;

  // Load profiles (simple approach since backend has GET /api/profiles but not GET by "me")
  const { data: profiles, isFetching } = useGetProfilesQuery();

  // Find current profile using profileId from token, otherwise try to match by email
  const currentProfile = useMemo(() => {
    if (!profiles || profiles.length === 0) return undefined;
    if (profileIdFromToken)
      return profiles.find((p) => p.id === profileIdFromToken);
    if (payload?.email) return profiles.find((p) => p.email === payload.email);
    return profiles[0];
  }, [profiles, profileIdFromToken, payload]);

  // Local form state
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Initialize form when profile loads
  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name ?? "");
      setLastName(currentProfile.lastName ?? "");
      setGender(currentProfile.gender ?? "");
      setBirthDate(
        currentProfile.birthDate
          ? new Date(currentProfile.birthDate).toISOString().slice(0, 10)
          : ""
      );
      setAddress(currentProfile.address ?? "");
      setPhone(currentProfile.phone ?? "");
    }
  }, [currentProfile]);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const onSave = async () => {
    if (!currentProfile) return;

    // Solo envía campos definidos; evita strings vacíos
    const body: Record<string, unknown> = {};
    if (name.trim()) body.name = name.trim();
    if (lastName.trim()) body.lastName = lastName.trim();
    if (gender && gender.trim()) body.gender = gender; // si no eliges, no lo envíes

    if (birthDate && birthDate.trim()) {
      // Normaliza a ISO 8601 completo para Prisma DateTime
      const dateIso = new Date(`${birthDate}T00:00:00Z`).toISOString();
      body.birthDate = dateIso;
    }

    if (address.trim()) body.address = address.trim();
    if (phone.trim()) body.phone = phone.trim();

    if (Object.keys(body).length === 0) {
      alert("No hay cambios para guardar");
      return;
    }

    console.debug("Enviando actualización de perfil", {
      id: currentProfile.id,
      body,
    });

    try {
      await updateProfile({ id: currentProfile.id, body }).unwrap();
      alert("Perfil actualizado correctamente");
    } catch (err: unknown) {
      console.error("Error al actualizar perfil:", err);
      const e = err as { status?: number; data?: { message?: unknown } };
      const status = e?.status;
      const dataMsg = e?.data?.message as unknown;
      const msg = dataMsg || `No se pudo actualizar el perfil (HTTP ${status ?? ""})`;
      alert(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-6 bg-[#F6F6F6]">
      <div className="flex justify-between items-center w-full">
        <button
          className="border-[#322C2C] border-[2px] p-3 rounded-xl"
          disabled={isSaving}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.61.933a.53.53 0 0 0-.75.05L.902 6.65a.53.53 0 0 0 0 .7l4.958 5.666a.531.531 0 0 0 .8-.7L2.472 7.532h10.163a.531.531 0 0 0 0-1.062H2.472L6.66 1.683a.53.53 0 0 0-.05-.75"
              fill="#322C2C"
            />
          </svg>
        </button>
        <h1 className="text-[#322C2C] text-[28px] font-extrabold">
          Editar perfil
        </h1>
        <button
          className="bg-[#00324A] p-3 rounded-xl disabled:opacity-60"
          onClick={onSave}
          disabled={isSaving || isFetching || !currentProfile}
        >
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m.71 9 4 3 9-11" stroke="#fff" stroke-width="1.5" />
          </svg>
        </button>
      </div>
      <div className=" w-[100px] h-[100px] flex flex-col  items-end-safe">
        <img src="/profilePic.webp" className="rounded-full" alt="" />
        <div className="translate-y-[-20px] -translate-x-[-5px] bg-white rounded-full p-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.375 11.656v2.969h2.969L12.1 5.869 9.13 2.9zm14.02-8.083a.79.79 0 0 0 0-1.116L12.543.605a.79.79 0 0 0-1.116 0l-1.45 1.448 2.97 2.97z"
              fill="#00324A"
            />
          </svg>
        </div>
      </div>
      <div className="flex w-full flex-col px-4">
        <h2 className="font-bold text-[22px]">Datos Personales</h2>
        <div className="flex flex-col space-y-1 mt-2">
          <span className="font-semibold text-[#00324A]">Nombres</span>
          <Input
            id="name"
            label="Nombre"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold text-[#00324A]">Apellidos</span>
          <Input
            id="name"
            label="Apellidos"
            type="text"
            placeholder="Apellidos"
            value={lastName}
            onChange={(e) => setLastName((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col space-y-1 w-full">
            <span className="font-semibold text-[#00324A]">Género</span>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full px-4 py-4 pr-10 text-sm rounded-2xl border border-[#DEDEDE] bg-[#EEEEEE] text-[#AEAEAE] focus:outline-none"
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="unspecified">No especificado</option>
            </select>
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <span className="font-semibold text-[#00324A]">
              Fecha de nacimiento
            </span>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="block w-full px-4 py-4 pr-10 text-sm rounded-2xl border border-[#DEDEDE] bg-[#EEEEEE] text-[#AEAEAE] focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col px-4 mt-4">
        <h2 className="font-bold text-[22px]">Contacto Personal</h2>
        <div className="flex flex-col space-y-1 mt-2">
          <span className="font-semibold text-[#00324A]">Dirección</span>
          <Input
            id="name"
            label="Dirección"
            type="text"
            placeholder="Ubicación, UBI 001"
            value={address}
            onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold text-[#00324A]">Teléfono</span>
          <Input
            id="name"
            label="Teléfono"
            type="text"
            placeholder="+12 345 678 9"
            value={phone}
            onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      {isFetching && (
        <p className="text-sm text-gray-500">Cargando perfil...</p>
      )}
      {!isFetching && !currentProfile && (
        <p className="text-sm text-red-600">
          No se encontró un perfil para el usuario.
        </p>
      )}
    </div>
  );
}
