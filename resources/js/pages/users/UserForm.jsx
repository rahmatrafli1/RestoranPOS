import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import userService from "../../services/userService";
import toast from "react-hot-toast";

const schema = yup
    .object({
        full_name: yup.string().required("Name is required").max(100),
        username: yup.string().required("Username is required").max(50),
        password: yup.string().when("$isEdit", {
            is: false,
            then: (schema) =>
                schema
                    .required("Password is required")
                    .min(6, "Password must be at least 6 characters"),
            otherwise: (schema) => schema.nullable(),
        }),
        password_confirmation: yup.string().when("password", {
            is: (value) => value && value.length > 0,
            then: (schema) =>
                schema.oneOf([yup.ref("password")], "Passwords must match"),
            otherwise: (schema) => schema.nullable(),
        }),
        role_id: yup
            .number()
            .required("Role is required")
            .typeError("Role is required"),
        phone: yup.string().nullable(),
        is_active: yup.boolean(),
    })
    .required();

const UserForm = ({ user, onSuccess, onCancel }) => {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        context: { isEdit: !!user },
        defaultValues: {
            full_name: "",
            username: "",
            password: "",
            password_confirmation: "",
            role_id: "",
            is_active: true,
        },
    });

    const password = watch("password");

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoadingRoles(true);
                const response = await userService.getRoles();

                // Handle response structure
                const rolesData = response.data?.data || response.data || [];
                setRoles(rolesData);
            } catch (error) {
                console.error("Failed to load roles:", error);
                toast.error("Failed to load roles");
                // Fallback roles if API fails
                setRoles([]);
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    // Set form data when user prop changes
    useEffect(() => {
        if (user) {
            const formData = {
                full_name: user.full_name || "",
                username: user.username || "",
                password: "",
                password_confirmation: "",
                role_id: user.role_id || (user.role ? user.role.id : ""),
                is_active: user.is_active !== undefined ? user.is_active : true,
            };

            reset(formData);
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                full_name: data.full_name,
                username: data.username,
                role_id: parseInt(data.role_id), // Convert to integer
                is_active: data.is_active,
            };

            // Only include password if provided
            if (data.password) {
                payload.password = data.password;
                payload.password_confirmation = data.password_confirmation;
            }

            if (user) {
                await userService.update(user.id, payload);
                toast.success("User updated successfully");
            } else {
                await userService.create(payload);
                toast.success("User created successfully");
            }
            onSuccess();
        } catch (error) {
            console.error("=== Form Submit Error ===");
            console.error("Error:", error);
            console.error("Error Response:", error.response?.data);
            console.error("====================");

            // Handle validation errors
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error(
                    error.response?.data?.message || "Failed to save user",
                );
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <Input
                    label="Full Name"
                    {...register("full_name")}
                    error={errors.full_name?.message}
                    placeholder="John Doe"
                    autoComplete="off"
                    required
                />
            </div>

            {/* Username */}
            <div>
                <Input
                    label="Username"
                    {...register("username")}
                    error={errors.username?.message}
                    placeholder="johndoe"
                    required
                    autoComplete="off"
                />
            </div>

            {/* Role */}
            <div>
                <label className="form-label">
                    Role <span className="text-danger-500">*</span>
                </label>
                {loadingRoles ? (
                    <div className="form-input text-gray-400">
                        Loading roles...
                    </div>
                ) : (
                    <select
                        {...register("role_id")}
                        className="form-input"
                        disabled={loadingRoles}
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                )}
                {errors.role_id && (
                    <p className="form-error">{errors.role_id.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <Input
                    label={
                        user
                            ? "New Password (leave blank to keep current)"
                            : "Password"
                    }
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                    placeholder="••••••••"
                    required={!user}
                    autoComplete="new-password"
                />
            </div>

            {/* Password Confirmation */}
            {password && (
                <div>
                    <Input
                        label="Confirm Password"
                        type="password"
                        {...register("password_confirmation")}
                        error={errors.password_confirmation?.message}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                    />
                </div>
            )}

            {/* Is Active */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-700"
                >
                    Active User
                </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    fullWidth
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    fullWidth
                >
                    {user ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
