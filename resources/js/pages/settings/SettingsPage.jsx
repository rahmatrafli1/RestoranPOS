import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import userService from "../../services/userService";
import toast from "react-hot-toast";

const profileSchema = yup
    .object({
        name: yup.string().required("Name is required"),
        email: yup.string().email("Invalid email").nullable(),
    })
    .required();

const passwordSchema = yup
    .object({
        current_password: yup.string().required("Current password is required"),
        new_password: yup
            .string()
            .required("New password is required")
            .min(6, "Password must be at least 6 characters"),
        new_password_confirmation: yup
            .string()
            .oneOf([yup.ref("new_password")], "Passwords must match"),
    })
    .required();

const SettingsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("profile");

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile, isSubmitting: isSubmittingProfile },
        reset: resetProfile,
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: "",
        },
    });

    // Password form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: {
            errors: errorsPassword,
            isSubmitting: isSubmittingPassword,
        },
        reset: resetPassword,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.full_name || "",
            });
        }
    }, [user, resetProfile]);

    const onSubmitProfile = async (data) => {
        try {
            await userService.updateProfile(data);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile",
            );
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            await userService.changePassword(data);
            toast.success("Password changed successfully");
            resetPassword();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to change password",
            );
        }
    };

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "password", label: "Change Password" },
        { id: "preferences", label: "Preferences" },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? "border-primary-600 text-primary-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <Card title="Profile Information">
                    <form
                        onSubmit={handleSubmitProfile(onSubmitProfile)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        {/* User Info Display */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="h-16 w-16 flex-shrink-0">
                                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-700 font-bold text-2xl">
                                        {user?.username
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {user?.full_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    @{user?.username}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Full Name"
                                {...registerProfile("name")}
                                error={errorsProfile.name?.message}
                                placeholder="John Doe"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <Input
                                label="Username"
                                value={user?.username || ""}
                                disabled
                                helperText="Username cannot be changed"
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmittingProfile}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
                <Card title="Change Password">
                    <form
                        onSubmit={handleSubmitPassword(onSubmitPassword)}
                        className="space-y-4"
                        autoComplete="off"
                    >
                        <div>
                            <Input
                                label="Current Password"
                                type="password"
                                {...registerPassword("current_password")}
                                error={errorsPassword.current_password?.message}
                                placeholder="••••••••"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <Input
                                label="New Password"
                                type="password"
                                {...registerPassword("new_password")}
                                error={errorsPassword.new_password?.message}
                                placeholder="••••••••"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <Input
                                label="Confirm New Password"
                                type="password"
                                {...registerPassword(
                                    "new_password_confirmation",
                                )}
                                error={
                                    errorsPassword.new_password_confirmation
                                        ?.message
                                }
                                placeholder="••••••••"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmittingPassword}
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
                <Card title="Preferences">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                Display
                            </h3>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Dark Mode
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Use dark theme for the interface
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Notifications
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Receive notifications for new orders
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Sound Effects
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Play sound for order notifications
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900">
                                Regional
                            </h3>

                            <div>
                                <label className="form-label">Language</label>
                                <select
                                    className="form-input"
                                    autoComplete="off"
                                >
                                    <option>English</option>
                                    <option>Bahasa Indonesia</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Timezone</label>
                                <select
                                    className="form-input"
                                    autoComplete="off"
                                >
                                    <option>Asia/Jakarta (GMT+7)</option>
                                    <option>Asia/Makassar (GMT+8)</option>
                                    <option>Asia/Jayapura (GMT+9)</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Currency</label>
                                <select
                                    className="form-input"
                                    autoComplete="off"
                                >
                                    <option>IDR (Rp)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button variant="primary">Save Preferences</Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SettingsPage;
