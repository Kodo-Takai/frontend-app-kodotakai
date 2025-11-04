import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
    return (
        <div
            className="cursor-pointer"
            style={{ color: 'var(--color-blue-light)' }}
            onClick={() => window.history.back()}
            aria-label="Regresar"
        >
            <div className="w-10 h-10 flex items-center justify-center border rounded-xl transition-colors" style={{ borderColor: 'var(--color-blue)' }}>
                <FaArrowLeft className="w-3.5 h-3.5"/>
            </div>
        </div>
    );
}