import React from "react";
import {
  ToastContainer,
  cssTransition,
  type TypeOptions,
  type CloseButtonProps,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";

// Transition mapped to your existing CSS animations
const TOASTIFY_TRANSITION = cssTransition({
  enter: "toast-slide-in",
  exit: "toast-fade-out",
});

// Visual design classes preserved from original component (without fixed positioning)
const baseClasses =
  "p-2.5 m-4 rounded-xl flex items-center gap-4 border-1 border-dashed border-[#295B72] text-[#295B72] font-semibold";

const typeBgClasses: Record<
  Exclude<TypeOptions, undefined> | "default",
  string
> = {
  success: "bg-[#FFFFF0]",
  error: "bg-[#FFF0F0]",
  warning: "bg-[#FFFBF0]",
  info: "bg-[#FFFBF0]",
  default: "bg-[#FFFBF0]",
};

const iconBgClasses: Record<
  Exclude<TypeOptions, undefined> | "default",
  string
> = {
  success: "bg-[#D1DC5A]",
  error: "bg-[#DC5A5A]",
  warning: "bg-[#DCB15A]",
  info: "bg-[#DCB15A]",
  default: "bg-[#DCB15A]",
};

// SVG Icons identical to original (props adapted to React camelCase)
const SuccessIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="#295B72"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.713 3.64c.581-.495.872-.743 1.176-.888a2.58 2.58 0 0 1 2.222 0c.304.145.595.393 1.176.888.599.51 1.207.768 2.007.831.761.061 1.142.092 1.46.204.734.26 1.312.837 1.571 1.572.112.317.143.698.204 1.46.063.8.32 1.407.83 2.006.496.581.744.872.889 1.176.336.703.336 1.52 0 2.222-.145.304-.393.595-.888 1.176a3.3 3.3 0 0 0-.831 2.007c-.061.761-.092 1.142-.204 1.46a2.58 2.58 0 0 1-1.572 1.571c-.317.112-.698.143-1.46.204-.8.063-1.407.32-2.006.83-.581.496-.872.744-1.176.889a2.58 2.58 0 0 1-2.222 0c-.304-.145-.595-.393-1.176-.888a3.3 3.3 0 0 0-2.007-.831c-.761-.061-1.142-.092-1.46-.204a2.58 2.58 0 0 1-1.571-1.572c-.112-.317-.143-.698-.204-1.46a3.3 3.3 0 0 0-.83-2.006c-.496-.581-.744-.872-.89-1.176a2.58 2.58 0 0 1 .001-2.222c.145-.304.393-.595.888-1.176.52-.611.769-1.223.831-2.007.061-.761.092-1.142.204-1.46a2.58 2.58 0 0 1 1.572-1.571c.317-.112.698-.143 1.46-.204a3.3 3.3 0 0 0 2.006-.83" />
    <path d="m8.667 12.633 1.505 1.721a1 1 0 0 0 1.564-.073L15.333 9.3" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="#fff"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const WarningIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="#fff"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.805 3.469C8.16 3.115 8.451 3 8.937 3h6.126c.486 0 .778.115 1.132.469l4.336 4.336c.354.354.469.646.469 1.132v6.126c0 .5-.125.788-.469 1.132l-4.336 4.336c-.354.354-.646.469-1.132.469H8.937c-.5 0-.788-.125-1.132-.469L3.47 16.195c-.355-.355-.47-.646-.47-1.132V8.937c0-.5.125-.788.469-1.132zM12 7.627v5.5m0 3.246v-.5" />
  </svg>
);

const IconFactory = ({ type }: { type?: TypeOptions }) => {
  const key = (type ?? "default") as
    | Exclude<TypeOptions, undefined>
    | "default";
  return (
    <div className={`p-1 rounded-xl ${iconBgClasses[key]}`}>
      {key === "success" && <SuccessIcon />}
      {key === "error" && <ErrorIcon />}
      {(key === "warning" || key === "info" || key === "default") && (
        <WarningIcon />
      )}
    </div>
  );
};

// Custom Close Button identical to original
const CloseButton: React.FC<CloseButtonProps> = ({ closeToast }) => (
  <button
    onClick={closeToast}
    aria-label="close"
    className="ml-4 bg-transparent rounded-md inline-flex items-center justify-center px-2"
  >
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="#295B72"
      strokeWidth="1"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  </button>
);

// Container that applies our exact style and animations globally
const CustomToastContainer: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      draggable={false}
      pauseOnHover
      closeButton={(props) => <CloseButton {...props} />}
      icon={({ type }) => <IconFactory type={type} />}
      transition={TOASTIFY_TRANSITION}
      toastClassName={(context) => {
        const t = (context?.type ?? "default") as
          | Exclude<TypeOptions, undefined>
          | "default";
        return `${baseClasses} ${typeBgClasses[t]}`;
      }}
      style={{ zIndex: 9999 }}
      theme="light"
    />
  );
};

export default CustomToastContainer;
