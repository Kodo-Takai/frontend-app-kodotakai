import PasswordRecoveryForm from "../components/Forms/FormPasswordRecovery"
import { FaArrowLeft } from "react-icons/fa"; 

function ForgotPassword() {
  return (
    <div className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-lg justify-center gap-6">
        <div
              className="cursor-pointer text-gray-500"
              onClick={() => window.history.back()}
              aria-label="Regresar"
            >
              <div className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
                <FaArrowLeft />
              </div>
            </div>
      <PasswordRecoveryForm />
    </div>
  )
}

export default ForgotPassword