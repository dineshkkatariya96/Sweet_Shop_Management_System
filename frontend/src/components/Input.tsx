interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}: InputProps) {
  return (
    <div className="mb-5">
      <label className="block text-gray-700 font-semibold mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
      />
    </div>
  );
}
