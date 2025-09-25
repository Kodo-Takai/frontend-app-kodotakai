import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
    return (
        <div
            className="cursor-pointer text-gray-500"
            onClick={() => window.history.back()}
            aria-label="Regresar"
        >
            <div className="w-10 h-10 flex items-center justify-center border border-[#322C2C] rounded-xl hover:bg-gray-100 transition-colors">
                <FaArrowLeft className="w-3.5 h-3.5"/>
            </div>
        </div>
    );
}