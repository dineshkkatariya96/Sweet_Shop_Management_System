interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}

export default function Input({ label, type = "text", value, onChange }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
