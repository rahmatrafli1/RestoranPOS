import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { formatCurrency } from '../../../utils/formatters';
import { HiShoppingCart, HiTrash, HiPlus, HiMinus, HiX } from 'react-icons/hi';

const CartSummary = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
}) => {
  return (
    <Card className="h-full flex flex-col" noPadding>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiShoppingCart className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Cart ({cart.items.length})
          </h2>
        </div>
        {cart.items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-danger-600 hover:text-danger-700 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <HiShoppingCart className="h-16 w-16 mb-3" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 space-y-2"
              >
                {/* Item Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-primary-600 font-semibold text-sm mt-1">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2 text-danger-600 hover:text-danger-700 p-1"
                  >
                    <HiX className="h-4 w-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      <HiMinus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      <HiPlus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {cart.items.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Calculations */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span className="font-medium">{formatCurrency(cart.tax)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex items-center justify-between text-danger-600">
                <span>Discount</span>
                <span className="font-medium">
                  -{formatCurrency(cart.discount)}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-gray-900">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">
                {formatCurrency(cart.total)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onCheckout}
            className="gap-2"
          >
            <HiShoppingCart className="h-5 w-5" />
            Checkout
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CartSummary;