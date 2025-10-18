import { useNavigate } from "react-router-dom";
import { useRegister } from "./useRegister";
import { useAuth } from "./useAuth";
import { useCreateUserPreferenceMutation } from "../../redux/api/userPreferencesApi";
import { useRegisterFlowContext } from "../../context/useRegisterFlowContext";
import { decodeJwt } from "../../utils/jwt";
import { useLazyGetProfilesQuery } from "../../redux/api/profileApi";
import { useLazyGetDestinationsQuery } from "../../redux/api/destinationsApi";

// AI payload format for clarity and reuse
export interface AIUserPreferencesPayload {
  travelerTypes: string[];
  travelingWith: string[];
  travelDuration: string[];
  activities: string[];
  placeTypes: string[];
  budget: string[]; // Económico | Medio | Premium
  transport: string[]; // Caminando | En bicicleta | En auto | En transporte público
}

export function useRegisterFlow() {
  const navigate = useNavigate();
  const { credentials, selections, setCredentials, reset } = useRegisterFlowContext();
  const { register } = useRegister();
  const { loginWithCredentials } = useAuth();
  const [createPref, { isLoading: isCreatingPref }] = useCreateUserPreferenceMutation();
  const [triggerGetProfiles] = useLazyGetProfilesQuery();
  const [triggerGetDestinations] = useLazyGetDestinationsQuery();

  // Move to next step
  const startFlow = (creds: Parameters<typeof setCredentials>[0]) => {
    setCredentials(creds);
    navigate("/register-travel");
  };

  const goActivities = () => navigate("/register-activities");
  const goPreferences = () => navigate("/register-preferences");

  // Build unified payload to store in `unliked` JSON string
  const buildAIPayload = (override?: Partial<typeof selections>): AIUserPreferencesPayload => {
    const merged = override ? { ...selections, ...override } : selections;
    return {
      travelerTypes: merged.travelerTypes,
      travelingWith: merged.travelingWith,
      travelDuration: merged.travelDuration,
      activities: merged.activities,
      placeTypes: merged.placeTypes,
      budget: merged.budget,
      transport: merged.transport,
    };
  };

  // Submit: register -> login to get token -> send preferences -> go home
  const completeAndSubmit = async (override?: Partial<typeof selections>) => {
    if (!credentials) return { success: false, error: "No hay credenciales" };

    // 1) Register user
    const reg = await register(credentials);
    if (!reg?.success) {
      return { success: false, error: reg?.error || "Error en registro" };
    }

    // 2) Login to get tokens and set auth
    const loginRes = await loginWithCredentials({
      username: credentials.username,
      password: credentials.password,
    });
    if (!loginRes?.success) {
      return { success: false, error: loginRes?.error || "Error al iniciar sesión" };
    }

    // 3) Persist preferences
    // NOTE: backend UserPreference requires an existing destination reference.
    // For MVP we will store a synthetic preference row that captures the user's global preferences
    // by using a special destinationId "00000000-0000-0000-0000-000000000000" and category "global".
  const aiPayload = buildAIPayload(override);

    try {
      // Resolve a real userId UUID from token or profiles
      const token = localStorage.getItem("token");
      let userId: string | undefined;
      const payload = decodeJwt(token);
      // backend payload includes profileId; we need the owning userId
      // Try to fetch profiles and match by email to get userId
      if (payload?.email) {
        const profiles = await triggerGetProfiles().unwrap();
        const profile = profiles.find((p) => p.email === payload.email);
        userId = profile?.userId;
      }
      // Fallback: use existing local user object id if present
      if (!userId) {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        userId = localUser?.id;
      }
      if (!userId) {
        throw new Error("No fue posible resolver el ID de usuario para preferencias");
      }

      // Pick a valid destination id to satisfy FK. Prefer any available.
      const destinations = await triggerGetDestinations().unwrap();
      const chosen = destinations?.[0];
      if (!chosen?.id) {
        throw new Error("No hay destinos disponibles para asociar las preferencias");
      }

      await createPref({
        userId,
        destinationId: chosen.id,
        unliked: JSON.stringify(aiPayload),
        precio: aiPayload.budget.includes("Premium") ? 3 : aiPayload.budget.includes("Medio") ? 2 : 1,
        category: chosen.category ?? "global",
      }).unwrap();
    } catch (e) {
      // Not blocking navigation; you can surface an error if needed
      console.warn("No se pudo guardar preferencias", e);
    }

    // 4) Done -> Home
    reset();
    navigate("/home");
    return { success: true };
  };

  return {
    isCreatingPref,
    startFlow,
    goActivities,
    goPreferences,
    completeAndSubmit,
  };
}
