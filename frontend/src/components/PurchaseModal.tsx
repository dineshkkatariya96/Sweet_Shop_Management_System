import { useState } from "react";

interface Props {
  sweetName: string;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}

export default function PurchaseModal({ sweetName, onConfirm, onCancel }: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-3">
          Buy {sweetName}
        </h2>

        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(quantity)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
