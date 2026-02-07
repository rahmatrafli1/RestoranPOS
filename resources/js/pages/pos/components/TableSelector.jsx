import React from 'react';
import Button from '../../../components/common/Button';
import { HiX } from 'react-icons/hi';

const TableSelector = ({ tables, onSelectTable, onCancel }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {tables.length > 0 ? (
          tables.map((table) => (
            <button
              key={table.id}
              onClick={() => onSelectTable(table)}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 mb-1">
                  {table.table_number}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {table.location}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {table.capacity} seats
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="font-medium mb-1">No tables available</p>
            <p className="text-sm">All tables are currently occupied</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TableSelector;