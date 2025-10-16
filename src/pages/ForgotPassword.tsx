import PasswordRecoveryForm from "../components/form/passwordRecoveryForm"
import { FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 rounded-lg justify-center gap-6" style={{ backgroundColor: 'var(--color-bone)' }}>
      <div
        className="cursor-pointer"
        style={{ color: 'var(--color-blue-light)' }}
        onClick={() => navigate("/login")}
        aria-label="Regresar"
      >
        <div className="w-10 h-10 flex items-center justify-center border rounded-md transition-colors" style={{ borderColor: 'var(--color-beige-dark)' }}>
          <FaArrowLeft />
        </div>
      </div>
      <PasswordRecoveryForm />
    </div>
  )
}

export default ForgotPassword