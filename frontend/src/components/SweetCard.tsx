interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface Props {
  sweet: Sweet;
  onBuy?: (id: number) => void;
}

export default function SweetCard({ sweet, onBuy }: Props) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{sweet.name}</h2>

      <p className="text-gray-600 mt-1">{sweet.category}</p>
      <p className="mt-1 font-medium text-green-600">₹{sweet.price}</p>
      <p className="mt-1 text-sm">Stock: {sweet.quantity}</p>

      {onBuy && (
        <button
          disabled={sweet.quantity === 0}
          onClick={() => onBuy(sweet.id)}
          className={`mt-4 w-full py-2 rounded text-white 
            ${sweet.quantity === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {sweet.quantity === 0 ? "Out of Stock" : "Buy"}
        </button>
      )}
    </div>
  );
}
