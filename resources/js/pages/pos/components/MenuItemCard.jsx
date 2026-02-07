import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { getImageUrl } from '../../../utils/helpers';
import { HiPlus } from 'react-icons/hi';

const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <div
      onClick={() => onAddToCart(item)}
      className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
          <div className="bg-primary-600 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all">
            <HiPlus className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">
          {item.category?.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-primary-600 font-bold text-base">
            {formatCurrency(item.price)}
          </p>
          <button className="btn btn-primary btn-sm px-3 py-1 text-xs">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;