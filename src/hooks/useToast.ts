import { toast, type TypeOptions } from "react-toastify";

type BackendSuccess<T = unknown> = {
  status_code?: number | string;
  message?: string;
  data?: { message?: string } & T;
};

type BackendError = {
  status_code?: number | string;
  error?: string;
  message?: string | string[];
  data?: unknown;
};

function extractMessage(input: unknown): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  const obj = input as BackendSuccess | BackendError;
  if (Array.isArray(obj?.message)) return obj?.message.join(" \n");
  return obj?.data && typeof (obj as BackendSuccess).data === "object" && (obj as BackendSuccess).data?.message
    ? (obj as BackendSuccess).data!.message!
    : obj?.message || "";
}

export function useToast() {
  const show = (type: Exclude<TypeOptions, undefined> | "warning", payload: unknown) => {
    const message = extractMessage(payload) || (type === "success" ? "Operación exitosa" : type === "error" ? "Ha ocurrido un error" : "Aviso");
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  };

  return {
    success: (payload: unknown) => show("success", payload),
    error: (payload: unknown) => show("error", payload),
    warning: (payload: unknown) => show("warning", payload),
    info: (payload: unknown) => show("info", payload),
  };
}
