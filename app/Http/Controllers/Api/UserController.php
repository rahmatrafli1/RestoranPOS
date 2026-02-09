<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users with role relationship
     */
    public function index(Request $request)
    {
        try {
            $query = User::with('role');

            // Filter by role_id
            if ($request->has('role_id')) {
                $query->where('role_id', $request->role_id);
            }

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            // Search
            if ($request->has('q')) {
                $search = $request->q;
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            }

            $users = $query->latest()->get();

            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user by ID with role relationship
     */
    public function show($id)
    {
        try {
            $user = User::with('role')->findOrFail($id);

            return response()->json([
                'message' => 'User retrieved successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create new user
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role_id' => 'required|exists:roles,id', // Changed to role_id
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'full_name' => $request->full_name,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role_id' => $request->role_id, // Use role_id
                'is_active' => $request->is_active ?? true,
            ]);

            // Load role relationship
            $user->load('role');

            return response()->json([
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'full_name' => 'required|string|max:255',
                'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
                'password' => 'nullable|string|min:6',
                'role_id' => 'required|exists:roles,id', // Changed to role_id
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = [
                'full_name' => $request->full_name,
                'username' => $request->username,
                'role_id' => $request->role_id, // Use role_id
                'is_active' => $request->is_active ?? $user->is_active,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);

            // Load role relationship
            $user->load('role');

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting own account
            if ($user->id === Auth::id()) {
                return response()->json([
                    'message' => 'You cannot delete your own account'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'is_active' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['is_active' => $request->is_active]);

            return response()->json([
                'message' => 'User status updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate user
     */
    public function activate($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['is_active' => true]);

            return response()->json([
                'message' => 'User activated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to activate user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate user
     */
    public function deactivate($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['is_active' => false]);

            return response()->json([
                'message' => 'User deactivated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to deactivate user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'message' => 'Password reset successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reset password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if username exists
     */
    public function checkUsername(Request $request)
    {
        $exists = User::where('username', $request->username)
            ->when($request->user_id, function ($query) use ($request) {
                return $query->where('id', '!=', $request->user_id);
            })
            ->exists();

        return response()->json([
            'exists' => $exists
        ]);
    }

    /**
     * Get user statistics with role breakdown
     */
    public function statistics()
    {
        try {
            $stats = [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'inactive' => User::where('is_active', false)->count(),
                'by_role' => User::with('role')
                    ->get()
                    ->groupBy(function ($user) {
                        return $user->role ? $user->role->name : 'no_role';
                    })
                    ->map(function ($users) {
                        return $users->count();
                    }),
            ];

            return response()->json([
                'message' => 'User statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available roles from roles table
     */
    public function getRoles()
    {
        try {
            $roles = \App\Models\Roles::select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(function ($role) {
                    return [
                        'value' => $role->id, // Use ID as value
                        'label' => ucfirst($role->name),
                        'name' => $role->name,
                        'description' => $role->description,
                    ];
                });

            return response()->json([
                'message' => 'Roles retrieved successfully',
                'data' => $roles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search users with role
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('q');

            $users = User::with('role')
                ->where('full_name', 'like', "%{$query}%")
                ->orWhere('username', 'like', "%{$query}%")
                ->limit(10)
                ->get();

            return response()->json([
                'message' => 'Search completed successfully',
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk delete users
     */
    public function bulkDelete(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Exclude current user
            $ids = array_diff($request->ids, [Auth::id()]);

            User::whereIn('id', $ids)->delete();

            return response()->json([
                'message' => 'Users deleted successfully',
                'deleted_count' => count($ids)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update users
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'exists:users,id',
                'is_active' => 'boolean',
                'role_id' => 'exists:roles,id', // Changed to role_id
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [];
            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->is_active;
            }
            if ($request->has('role_id')) {
                $updateData['role_id'] = $request->role_id; // Use role_id
            }

            User::whereIn('id', $request->ids)->update($updateData);

            return response()->json([
                'message' => 'Users updated successfully',
                'updated_count' => count($request->ids)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
