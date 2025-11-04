import { createContext } from "react";

// Precise types for the multi-step register + preferences flow
export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    lastName: string;
}

export type BudgetLevel = "Económico" | "Medio" | "Premium";
export type TransportMode =
    | "Caminando"
    | "En bicicleta"
    | "En auto"
    | "En transporte público";

export interface PreferencesSelections {
    travelerTypes: string[]; // e.g., Relax, Cultural, Nocturno, ...
    travelingWith: string[]; // Solo/a, En pareja, ...
    travelDuration: string[]; // 1 día, Fin de semana, ...
    activities: string[]; // Hacer senderismo, Playa, ...
    placeTypes: string[]; // Urbanos, De playa, ...
    budget: BudgetLevel[];
    transport: TransportMode[];
}

export const emptySelections: PreferencesSelections = {
    travelerTypes: [],
    travelingWith: [],
    travelDuration: [],
    activities: [],
    placeTypes: [],
    budget: [],
    transport: [],
};

export interface RegisterFlowContextValue {
    credentials: RegisterCredentials | null;
    selections: PreferencesSelections;
    setCredentials: (c: RegisterCredentials) => void;
    updateSelections: (partial: Partial<PreferencesSelections>) => void;
    reset: () => void;
}

export const RegisterFlowContext = createContext<
    RegisterFlowContextValue | undefined
>(undefined);

export default RegisterFlowContext;