<?php
// filepath: app/Http/Requests/Order/AddDiscountRequest.php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'discount' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'discount.required' => 'Discount is required',
            'discount.numeric' => 'Discount must be a number',
            'discount.min' => 'Discount must be at least 0',
            'discount.max' => 'Discount may not be greater than 99999999.99',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $order = $this->route('order');
            
            if ($order && $this->input('discount') > $order->subtotal) {
                $validator->errors()->add('discount', 'Diskon tidak boleh lebih besar dari subtotal');
            }
        });
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }
}