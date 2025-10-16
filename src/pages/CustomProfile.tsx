import Input from "../components/ui/input";
import ImagePicker from "../components/ui/imagePicker";
import CustomSelect from "../components/ui/customSelect";
import CustomDateInput from "../components/ui/customDateInput";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  useGetProfilesQuery,
  useUpdateProfileMutation,
} from "../redux/api/profileApi";
import { decodeJwt } from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import { useImageUpload } from "../hooks/useImageUpload";
import { useToast } from "../hooks/useToast";

export default function CustomProfile() {
  const navigate = useNavigate();
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();
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

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");

  const [originalData, setOriginalData] = useState({
    name: "",
    lastName: "",
    gender: "",
    birthDate: "",
    address: "",
    phone: "",
    profileImage: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const {
    isUploading,
    error: uploadError,
    uploadImage,
    clearError,
  } = useImageUpload();

  useEffect(() => {
    if (currentProfile) {
      const formattedBirthDate = currentProfile.birthDate
        ? new Date(currentProfile.birthDate).toISOString().slice(0, 10)
        : "";

      const initialData = {
        name: currentProfile.name ?? "",
        lastName: currentProfile.lastName ?? "",
        gender: currentProfile.gender ?? "",
        birthDate: formattedBirthDate,
        address: currentProfile.address ?? "",
        phone: currentProfile.phone ?? "",
        profileImage: currentProfile.photo ?? "",
      };

      setName(initialData.name);
      setLastName(initialData.lastName);
      setGender(initialData.gender);
      setBirthDate(initialData.birthDate);
      setAddress(initialData.address);
      setPhone(initialData.phone);
      setProfileImage(initialData.profileImage);

      setOriginalData(initialData);
      setHasUnsavedChanges(false);
    }
  }, [currentProfile]);

  const checkForChanges = useCallback(() => {
    const currentData = {
      name,
      lastName,
      gender,
      birthDate,
      address,
      phone,
      profileImage,
    };

    const hasChanges = Object.keys(originalData).some(
      (key) =>
        currentData[key as keyof typeof currentData] !==
        originalData[key as keyof typeof originalData]
    );

    setHasUnsavedChanges(hasChanges);
  }, [
    name,
    lastName,
    gender,
    birthDate,
    address,
    phone,
    profileImage,
    originalData,
  ]);

  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const handleImageSelect = async (file: File) => {
    try {
      clearError();
      const imageUrl = await uploadImage(file);
      setProfileImage(imageUrl);

      if (currentProfile) {
        await updateProfile({
          id: currentProfile.id,
          body: { photo: imageUrl },
        }).unwrap();

        setOriginalData((prev) => ({ ...prev, profileImage: imageUrl }));
        toastSuccess({ message: "Imagen de perfil actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar imagen:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir la imagen";
      toastError({ message: errorMessage });
    }
  };

  const onSave = async () => {
    if (!currentProfile) return;

    const body: Record<string, unknown> = {};
    if (name.trim()) body.name = name.trim();
    if (lastName.trim()) body.lastName = lastName.trim();
    if (gender && gender.trim()) body.gender = gender;

    if (birthDate && birthDate.trim()) {
      const dateIso = new Date(`${birthDate}T00:00:00Z`).toISOString();
      body.birthDate = dateIso;
    }

    if (address.trim()) body.address = address.trim();
    if (phone.trim()) body.phone = phone.trim();

    if (Object.keys(body).length === 0) {
      toastWarning({ message: "No hay cambios para guardar" });
      return;
    }

    console.debug("Enviando actualización de perfil", {
      id: currentProfile.id,
      body,
    });

    try {
      await updateProfile({ id: currentProfile.id, body }).unwrap();

      const updatedData = {
        name: name.trim() || originalData.name,
        lastName: lastName.trim() || originalData.lastName,
        gender: gender || originalData.gender,
        birthDate: birthDate || originalData.birthDate,
        address: address.trim() || originalData.address,
        phone: phone.trim() || originalData.phone,
        profileImage: originalData.profileImage,
      };
      setOriginalData(updatedData);
      setHasUnsavedChanges(false);

      toastSuccess({ message: "Perfil actualizado correctamente" });

      navigate("/profile");
    } catch (err: unknown) {
      console.error("Error al actualizar perfil:", err);
      const e = err as { status?: number; data?: { message?: unknown } };
      const status = e?.status;
      const dataMsg = e?.data?.message as unknown;
      const msg =
        dataMsg || `No se pudo actualizar el perfil (HTTP ${status ?? ""})`;
      toastError(Array.isArray(msg) ? msg.join("\n") : String(msg));
    }
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true);
    } else {
      navigate("/profile");
    }
  };

  const handleDiscardAndExit = () => {
    setShowExitModal(false);
    navigate("/profile");
  };

  const handleSaveAndExit = async () => {
    await onSave();
    setShowExitModal(false);
    navigate("/profile");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 space-y-6 bg-[#F6F6F6]">
      <div className="flex justify-between items-center w-full">
        <button
          className="border-[#322C2C] border-[2px] p-3 rounded-xl"
          disabled={isSaving}
          onClick={handleBackClick}
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
        <h1 className="text-[#322C2C] text-[28px] font-extrabold flex items-center gap-2">
          Editar perfil
          {hasUnsavedChanges && (
            <span className="text-[#DC1217] text-sm">•</span>
          )}
        </h1>
        <button
          className={`relative p-3 rounded-xl disabled:opacity-60 transition-all duration-200 ${
            hasUnsavedChanges ? "bg-[#DC1217] animate-pulse" : "bg-[#00324A]"
          }`}
          onClick={onSave}
          disabled={isSaving || isFetching || !currentProfile}
          title={
            hasUnsavedChanges ? "Tienes cambios sin guardar" : "Guardar cambios"
          }
        >
          {hasUnsavedChanges && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
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
      <ImagePicker
        currentImage={profileImage}
        onImageSelect={handleImageSelect}
        isUploading={isUploading}
        disabled={isSaving || isFetching}
        className="self-center"
      />

      {uploadError && (
        <div className="text-red-600 text-sm text-center px-4">
          {uploadError}
        </div>
      )}
      <div className="flex w-full flex-col px-2">
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
            <CustomSelect
              id="gender"
              name="gender"
              value={gender}
              onChange={setGender}
              options={[
                { value: "male", label: "Hombre" },
                { value: "female", label: "Mujer" },
                { value: "unspecified", label: "No especificado" },
              ]}
              placeholder="Selecciona una opción"
              disabled={isSaving || isFetching}
            />
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <span className="font-semibold text-[#00324A]">
              Fecha de nacimiento
            </span>
            <CustomDateInput
              id="birthDate"
              name="birthDate"
              value={birthDate}
              onChange={setBirthDate}
              disabled={isSaving || isFetching}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col px-2 mt-4">
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

      {/* Modal de confirmación para salir sin guardar */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ¿Seguro que deseas salir?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tienes cambios sin guardar que se perderán si sales ahora.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDiscardAndExit}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSaving}
              >
                Descartar
              </button>
              <button
                onClick={handleSaveAndExit}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#00324A] border border-transparent rounded-lg hover:bg-[#004060] focus:outline-none focus:ring-2 focus:ring-[#00324A] disabled:opacity-60"
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>

            <button
              onClick={() => setShowExitModal(false)}
              className="w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
