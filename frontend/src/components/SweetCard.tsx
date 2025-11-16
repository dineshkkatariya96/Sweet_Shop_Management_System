import { ShoppingCartIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { Sweet } from "../types";

interface Props {
  sweet: Sweet;
  onBuy: (sweet: Sweet) => void;
}

export default function SweetCard({ sweet, onBuy }: Props) {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="animate-fade-in-up glass rounded-2xl p-6 card-hover group relative overflow-hidden h-full flex flex-col">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Category Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
            {sweet.category}
          </span>
          {isOutOfStock && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span>Out</span>
            </div>
          )}
        </div>

        {/* Sweet Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
          {sweet.name}
        </h2>

        {/* Stock Level */}
        <div className="mb-4 grow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Stock Level</span>
            <span
              className={`text-sm font-bold ${
                sweet.quantity > 10
                  ? "text-green-600"
                  : sweet.quantity > 0
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {sweet.quantity} items
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                sweet.quantity > 10
                  ? "bg-green-500"
                  : sweet.quantity > 0
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min((sweet.quantity / 20) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* Price */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">Price</p>
          <p className="text-3xl font-extrabold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{sweet.price}
          </p>
        </div>

        {/* Button */}
        <button
          disabled={isOutOfStock}
          onClick={() => onBuy(sweet)}
          className={`w-full mt-auto py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-400/50 hover:scale-105"
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {isOutOfStock ? "Out of Stock" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
