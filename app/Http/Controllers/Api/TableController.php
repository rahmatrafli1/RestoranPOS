<?php
// filepath: app/Http/Controllers/Api/TableController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Table\StoreTableRequest;
use App\Http\Requests\Table\UpdateTableRequest;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index(Request $request)
    {
        $query = Table::with('activeOrder');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('location')) {
            $query->where('location', $request->location);
        }

        $tables = $query->orderBy('table_number')->get();

        return response()->json([
            'message' => 'Tables successfully retrieved',
            'data' => $tables
        ]);
    }

    public function store(StoreTableRequest $request)
    {
        $table = Table::create($request->validated());

        return response()->json([
            'message' => 'Table successfully created',
            'data' => $table
        ], 201);
    }

    public function show(Table $table)
    {
        $table->load('activeOrder.orderItems.menuItem');

        return response()->json([
            'message' => 'Table successfully retrieved',
            'data' => $table
        ]);
    }

    public function update(UpdateTableRequest $request, Table $table)
    {
        $table->update($request->validated());

        return response()->json([
            'message' => 'Table successfully updated',
            'data' => $table
        ]);
    }

    public function destroy(Table $table)
    {
        if ($table->status === 'occupied') {
            return response()->json([
                'message' => 'Cannot delete a table that is currently occupied'
            ], 422);
        }

        $table->delete();

        return response()->json([
            'message' => 'Table successfully deleted'
        ]);
    }

    public function available()
    {
        $tables = Table::available()->orderBy('table_number')->get();

        return response()->json([
            'message' => 'Tables successfully retrieved',
            'data' => $tables
        ]);
    }
}