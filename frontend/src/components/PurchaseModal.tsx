import { useState } from "react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface Props {
  sweetName: string;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}

export default function PurchaseModal({ sweetName, onConfirm, onCancel }: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="glass rounded-3xl w-full max-w-md shadow-2xl p-8 animate-fade-in-up relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-pink-500/10" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-all z-10"
        >
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {sweetName}
              </h2>
              <p className="text-gray-600 text-sm">Select quantity to buy</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6" />

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-4">
              Quantity
            </label>
            <div className="flex items-center justify-center gap-6 bg-linear-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-gray-200">
              <button
                onClick={handleDecrement}
                className="p-3 hover:bg-white rounded-full transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                <MinusIcon className="h-6 w-6 text-purple-600 font-bold" />
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-24 text-center text-4xl font-extrabold bg-transparent outline-none text-purple-600"
              />
              <button
                onClick={handleIncrement}
                className="p-3 hover:bg-white rounded-full transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                <PlusIcon className="h-6 w-6 text-green-600 font-bold" />
              </button>
            </div>
            <p className="text-center text-gray-600 text-sm mt-3">
              <span className="font-semibold text-gray-900">Total: {quantity} item{quantity > 1 ? 's' : ''}</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all transform active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(quantity)}
              className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-400/50 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Buy ({quantity})
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Click the + button to increase or - button to decrease quantity
          </p>
        </div>
      </div>
    </div>
  );
}
