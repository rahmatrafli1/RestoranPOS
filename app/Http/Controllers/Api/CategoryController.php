<?php
// filepath: app/Http/Controllers/Api/CategoryController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('menuItems')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Category successfully retrieved',
            'data' => $categories
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return response()->json([
            'message' => 'Category successfully created',
            'data' => $category
        ], 201);
    }

    public function show(Category $category)
    {
        $category->load('menuItems');

        return response()->json([
            'message' => 'Category successfully retrieved',
            'data' => $category
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return response()->json([
            'message' => 'Category successfully updated',
            'data' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->menuItems()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with menu items'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category successfully deleted'
        ]);
    }
}