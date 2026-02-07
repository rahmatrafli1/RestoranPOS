import React from 'react';
import { HiHome, HiShoppingBag, HiTruck } from 'react-icons/hi';

const OrderTypeSelector = ({ selectedType, onTypeChange, tableName }) => {
  const types = [
    { value: 'dine_in', label: 'Dine In', icon: HiHome },
    { value: 'takeaway', label: 'Takeaway', icon: HiShoppingBag },
    { value: 'delivery', label: 'Delivery', icon: HiTruck },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Order Type</label>
      <div className="grid grid-cols-3 gap-3">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.value;
          
          return (
            <button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">{type.label}</p>
            </button>
          );
        })}
      </div>
      
      {selectedType === 'dine_in' && tableName && (
        <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-800">
            <span className="font-medium">Selected:</span> {tableName}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTypeSelector;