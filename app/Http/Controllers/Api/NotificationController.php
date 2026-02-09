<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Get all notifications for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $notifications = Notification::where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhereNull('user_id');
            })
                ->latest()
                ->paginate(20);

            // Format response sesuai yang diharapkan frontend
            return response()->json([
                'message' => 'Notifications retrieved successfully',
                'data' => $notifications->items(), // Array of notifications
                'meta' => [
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage(),
                'data' => [] // Return empty array on error
            ], 500);
        }
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(Request $request)
    {
        try {
            $count = Notification::where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhereNull('user_id');
            })
                ->where('is_read', false)
                ->count();

            return response()->json([
                'message' => 'Unread count retrieved successfully',
                'count' => $count
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch unread count: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch unread count',
                'error' => $e->getMessage(),
                'count' => 0 // Return 0 on error
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

            return response()->json([
                'message' => 'Notification marked as read',
                'data' => $notification
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to mark as read: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        try {
            Notification::where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhereNull('user_id');
            })
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);

            return response()->json([
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to mark all as read: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to mark all as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete notification: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all notifications
     */
    public function clearAll(Request $request)
    {
        try {
            Notification::where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhereNull('user_id');
            })
                ->delete();

            return response()->json([
                'message' => 'All notifications cleared'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to clear notifications: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to clear notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
