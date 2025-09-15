import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { FaArrowLeft } from "react-icons/fa";
import RegisterForm from "../components/form/registerForm";

export default function Register() {
    const navigate = useNavigate();
    const { handleSubmit } = useRegisterForm();
    
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(() => navigate("/login"));
    };
    
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg justify-center">
            <div 
            className="cursor-pointer text-gray-500"
            onClick={() => window.history.back()}
            aria-label="Regresar"
            >
                <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
                    <FaArrowLeft />
                </div>
            </div>
            <h2 className="text-4xl font-extrabold text-[#1C222B] mb-4 mt-4 font-sf-pro">
            Crea tu <a className="text-[#DC1217]">nueva</a> <br /> cuenta
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Crea una cuenta para que puedas comenzar una nueva 
                aventura y disfrutar la experiencia al máximo
            </p>

            <RegisterForm onSubmit={onSubmit} />

        </div>
    );
}