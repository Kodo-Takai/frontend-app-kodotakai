import { useContext } from "react";
import { RegisterFlowProvider as _Provider } from "./registerFlowContext";
import RegisterFlowInternal from "./registerFlowInternal";

export const RegisterFlowProvider = _Provider;

export function useRegisterFlowContext() {
    const ctx = useContext(RegisterFlowInternal);
    if (!ctx) throw new Error("useRegisterFlowContext must be used within RegisterFlowProvider");
    return ctx;
}