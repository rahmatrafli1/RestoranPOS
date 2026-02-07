<?php
// filepath: app/Http/Requests/Payment/StorePaymentRequest.php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method' => [
                'required',
                'string',
                'in:cash,debit_card,credit_card,e-wallet,qris',
            ],
            'paid_amount' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
            'transaction_ref' => [
                'nullable',
                'string',
                'max:100',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'Payment method is required.',
            'payment_method.string' => 'Payment method must be a string.',
            'payment_method.in' => 'Payment method must be one of the following: cash, debit_card, credit_card, e-wallet, qris.',
            'paid_amount.required' => 'Paid amount is required.',
            'paid_amount.numeric' => 'Paid amount must be a number.',
            'paid_amount.min' => 'Paid amount must be at least 0.',
            'paid_amount.max' => 'Paid amount may not be greater than 99999999.99.',
            'transaction_ref.string' => 'Transaction reference must be a string.',
            'transaction_ref.max' => 'Transaction reference may not be greater than 100 characters.',
            'notes.string' => 'Notes must be a string.',
            'notes.max' => 'Notes may not be greater than 1000 characters.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $order = $this->route('order');
            
            if ($order && $this->input('paid_amount') < $order->total) {
                $validator->errors()->add('paid_amount', 'Jumlah pembayaran kurang dari total tagihan');
            }

            // Validate transaction_ref required for digital payment
            if (in_array($this->input('payment_method'), ['debit_card', 'credit_card', 'e-wallet', 'qris'])) {
                if (!$this->input('transaction_ref')) {
                    $validator->errors()->add('transaction_ref', 'Referensi transaksi wajib diisi untuk pembayaran digital');
                }
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