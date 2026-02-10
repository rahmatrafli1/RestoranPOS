import React, { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import UserForm from "./UserForm";
import userService from "../../services/userService";
import { formatDateTime } from "../../utils/formatters";
import toast from "react-hot-toast";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();

            // Fix: Handle different response structures
            let userData = [];
            if (response.data) {
                if (Array.isArray(response.data)) {
                    userData = response.data;
                } else if (
                    response.data.data &&
                    Array.isArray(response.data.data)
                ) {
                    // For paginated response
                    userData = response.data.data;
                } else if (
                    response.data.users &&
                    Array.isArray(response.data.users)
                ) {
                    userData = response.data.users;
                }
            }

            setUsers(userData);
        } catch (error) {
            console.error("Failed to load users:", error);
            console.error("Error Response:", error.response?.data);
            toast.error("Failed to load users");
            setUsers([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await userService.delete(id);
            toast.success("User deleted successfully");
            fetchUsers();
            setDeleteConfirm(null);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete user",
            );
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
    };

    const getRoleVariant = (role) => {
        const variants = {
            admin: "danger",
            cashier: "primary",
            waiter: "warning",
            chef: "success",
            guest: "secondary",
        };
        return variants[role] || "secondary";
    };

    const filteredUsers = Array.isArray(users)
        ? users.filter(
              (user) =>
                  user.full_name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  user.username
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
          )
        : [];

    const getUserCountByRole = (role) => {
        const count = Array.isArray(users)
            ? users.filter((u) => u.role.name === role).length
            : 0;
        return count;
    };

    const getActiveUserCount = () => {
        const count = Array.isArray(users)
            ? users.filter((u) => u.is_active).length
            : 0;
        return count;
    };

    if (loading) {
        return <Loading fullScreen text="Loading users..." />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage system users (
                        {Array.isArray(users) ? users.length : 0} total)
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    className="gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(users) ? users.length : 0}
                    </p>
                </Card>
                <Card className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Admins</p>
                    <p className="text-2xl font-bold text-danger-600">
                        {getUserCountByRole("admin")}
                    </p>
                </Card>
                <Card className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Cashiers</p>
                    <p className="text-2xl font-bold text-primary-600">
                        {getUserCountByRole("cashier")}
                    </p>
                </Card>
                <Card className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-2xl font-bold text-success-600">
                        {getActiveUserCount()}
                    </p>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <span className="text-primary-700 font-medium text-sm">
                                                            {user.full_name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "U"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.full_name ||
                                                            "Unknown"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {user.username || "-"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={getRoleVariant(
                                                    user.role.name,
                                                )}
                                            >
                                                {user.role.name || "N/A"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge
                                                variant={
                                                    user.is_active
                                                        ? "success"
                                                        : "secondary"
                                                }
                                            >
                                                {user.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.created_at
                                                ? formatDateTime(
                                                      user.created_at,
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    <HiPencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteConfirm(user)
                                                    }
                                                >
                                                    <HiTrash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        {searchTerm
                                            ? "No users found matching your search"
                                            : "No users found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                title={selectedUser ? "Edit User" : "Create User"}
                size="md"
            >
                <UserForm
                    user={selectedUser}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title="Delete User"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete user{" "}
                        <strong>{deleteConfirm?.full_name}</strong>? This action
                        cannot be undone.
                    </p>
                    <div className="flex items-center gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirm(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(deleteConfirm.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserList;
