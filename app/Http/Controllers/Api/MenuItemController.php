<?php
// filepath: app/Http/Controllers/Api/MenuItemController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MenuItem\StoreMenuItemRequest;
use App\Http\Requests\MenuItem\UpdateMenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_available')) {
            $query->where('is_available', $request->is_available);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $menuItems = $query->orderBy('name')->get();

        return response()->json([
            'message' => 'Menu items successfully retrieved',
            'data' => $menuItems
        ]);
    }

    public function store(StoreMenuItemRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('menu-items', 'public');
            $data['image_url'] = $path;
        }

        $menuItem = MenuItem::create($data);
        $menuItem->load('category');

        return response()->json([
            'message' => 'Menu item successfully created',
            'data' => $menuItem
        ], 201);
    }

    public function show(MenuItem $menuItem)
    {
        $menuItem->load('category');

        return response()->json([
            'message' => 'Menu item successfully retrieved',
            'data' => $menuItem
        ]);
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem)
    {
        $data = $request->validated();

        if ($request->hasFile('image_url')) {
            if ($menuItem->image_url) {
                Storage::disk('public')->delete($menuItem->image_url);
            }

            $path = $request->file('image_url')->store('menu-items', 'public');
            $data['image_url'] = $path;
        }

        $menuItem->update($data);
        $menuItem->load('category');

        return response()->json([
            'message' => 'Menu item successfully updated',
            'data' => $menuItem
        ]);
    }

    public function destroy(MenuItem $menuItem)
    {
        if ($menuItem->image_url) {
            Storage::disk('public')->delete($menuItem->image_url);
        }

        $menuItem->delete();

        return response()->json([
            'message' => 'Menu item successfully deleted'
        ]);
    }

    public function toggleAvailability(MenuItem $menuItem)
    {
        $menuItem->update([
            'is_available' => !$menuItem->is_available
        ]);

        return response()->json([
            'message' => 'Availability status successfully updated',
            'data' => $menuItem
        ]);
    }
}
