<?php
// filepath: app/Http/Requests/Order/UpdateOrderItemStatusRequest.php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateOrderItemStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                'in:pending,preparing,ready,served,cancelled',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Order item status is required.',
            'status.string' => 'Order item status must be a string.',
            'status.in' => 'Order item status must be one of the following: pending, preparing, ready, served, cancelled.',
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