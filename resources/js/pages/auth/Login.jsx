import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { login, clearError } from "../../store/slices/authSlice";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";
import { HiUser, HiLockClosed } from "react-icons/hi";

// Validation schema
const schema = yup
    .object({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    })
    .required();

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector(
        (state) => state.auth,
    );
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // Clear error on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(login(data)).unwrap();
            toast.success(result.message || "Login successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        RestoranPOS
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Error Alert */}
                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => dispatch(clearError())}
                            className="mb-6"
                        />
                    )}

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Username Field */}
                        <div>
                            <label className="form-label flex items-center gap-2">
                                <HiUser className="h-4 w-4 text-gray-400" />
                                Username
                            </label>
                            <input
                                {...register("username")}
                                type="text"
                                placeholder="Enter your username"
                                className="form-input"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.username && (
                                <p className="form-error">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="form-label flex items-center gap-2">
                                <HiLockClosed className="h-4 w-4 text-gray-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="form-input pr-10"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="form-error">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                            className="h-12"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center mb-3">
                            Demo Credentials:
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-gray-700 mb-1">
                                    Admin
                                </p>
                                <p className="text-gray-600">
                                    admin / password
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-gray-700 mb-1">
                                    Kasir
                                </p>
                                <p className="text-gray-600">
                                    kasir1 / password
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-gray-700 mb-1">
                                    Pelayan
                                </p>
                                <p className="text-gray-600">
                                    pelayan1 / password
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-gray-700 mb-1">
                                    Dapur
                                </p>
                                <p className="text-gray-600">
                                    dapur1 / password
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    © 2026 RestoranPOS. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
