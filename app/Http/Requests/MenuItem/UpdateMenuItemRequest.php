<?php
// filepath: app/Http/Requests/MenuItem/UpdateMenuItemRequest.php

namespace App\Http\Requests\MenuItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:categories,id',
            ],
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:2048',
            ],
            'is_available' => [
                'nullable',
                'boolean',
            ],
            'preparation_time' => [
                'nullable',
                'integer',
                'min:1',
                'max:999',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required.',
            'category_id.integer' => 'Category must be a valid integer.',
            'category_id.exists' => 'Selected category does not exist.',
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'name.max' => 'Name may not be greater than 100 characters.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description may not be greater than 1000 characters.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price must be at least 0.',
            'price.max' => 'Price may not be greater than 99999999.99.',
            'image.image' => 'Image must be an image file.',
            'image.mimes' => 'Image must be a file of type: jpeg, png, jpg, webp.',
            'image.max' => 'Image may not be greater than 2MB.',
            'is_available.boolean' => 'Is Available must be true or false.',
            'preparation_time.integer' => 'Preparation Time must be a valid integer.',
            'preparation_time.min' => 'Preparation Time must be at least 1 minute.',
            'preparation_time.max' => 'Preparation Time may not be greater than 999 minutes.',
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