<?php
// filepath: app/Http/Requests/Order/StoreOrderRequest.php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'order_type' => [
                'required',
                'string',
                'in:dine_in,takeaway,delivery',
            ],
            'customer_name' => [
                'nullable',
                'string',
                'max:100',
            ],
            'items' => [
                'required',
                'array',
                'min:1',
            ],
            'items.*.menu_item_id' => [
                'required',
                'integer',
                'exists:menu_items,id',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],
            'items.*.notes' => [
                'nullable',
                'string',
                'max:500',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];

        // Table ID required only for dine_in
        if ($this->input('order_type') === 'dine_in') {
            $rules['table_id'] = [
                'required',
                'integer',
                'exists:tables,id',
            ];
        } else {
            $rules['table_id'] = [
                'nullable',
                'integer',
                'exists:tables,id',
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'order_type.required' => 'Order type is required.',
            'order_type.in' => 'Order type must be one of the following: dine_in, takeaway, delivery.',
            'customer_name.max' => 'Customer name may not be greater than 100 characters.',
            'items.required' => 'At least one order item is required.',
            'items.array' => 'Items must be an array.',
            'items.min' => 'At least one order item is required.',
            'items.*.menu_item_id.required' => 'Menu item ID is required for each item.',
            'items.*.menu_item_id.integer' => 'Menu item ID must be an integer.',
            'items.*.menu_item_id.exists' => 'Selected menu item does not exist.',
            'items.*.quantity.required' => 'Quantity is required for each item.',
            'items.*.quantity.integer' => 'Quantity must be an integer.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.quantity.max' => 'Quantity may not be greater than 100.',
            'items.*.notes.max' => 'Item notes may not be greater than 500 characters.',
            'notes.max' => 'Order notes may not be greater than 1000 characters.',
            'table_id.required' => 'Table ID is required for dine-in orders.',
            'table_id.integer' => 'Table ID must be an integer.',
            'table_id.exists' => 'Selected table does not exist.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Additional validation: Check if table is available for dine_in
        if ($this->input('order_type') === 'dine_in' && $this->input('table_id')) {
            $table = \App\Models\Table::find($this->input('table_id'));
            
            if ($table && $table->status !== 'available') {
                throw new HttpResponseException(response()->json([
                    'message' => 'Validation errors',
                    'errors' => [
                        'table_id' => ['Meja tidak tersedia. Status: ' . $table->status]
                    ]
                ], 422));
            }
        }
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }
}