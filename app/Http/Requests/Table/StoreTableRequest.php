<?php
// filepath: app/Http/Requests/Table/StoreTableRequest.php

namespace App\Http\Requests\Table;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_number' => [
                'required',
                'string',
                'max:10',
                'unique:tables,table_number',
            ],
            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:50',
            ],
            'location' => [
                'nullable',
                'string',
                'in:indoor,outdoor,vip',
            ],
            'status' => [
                'nullable',
                'string',
                'in:available,occupied,reserved,maintenance',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'table_number.required' => 'Table number is required.',
            'table_number.string' => 'Table number must be a string.',
            'table_number.max' => 'Table number may not be greater than 10 characters.',
            'table_number.unique' => 'Table number has already been taken.',
            'capacity.required' => 'Capacity is required.',
            'capacity.integer' => 'Capacity must be an integer.',
            'capacity.min' => 'Capacity must be at least 1.',
            'capacity.max' => 'Capacity may not be greater than 50.',
            'location.in' => 'Location must be one of the following: indoor, outdoor, vip.',
            'status.in' => 'Status must be one of the following: available, occupied, reserved, maintenance.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }
}