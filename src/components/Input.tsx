import './Input.css';

interface InputProps {
  id: string;
  name: string;
  type: 'email' | 'password' | 'text';
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const Input = ({
  id,
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder,
  required = false
}: InputProps) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
