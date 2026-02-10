import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../store/slices/authSlice";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import toast from "react-hot-toast";
import { HiShoppingCart, HiEye, HiEyeOff } from "react-icons/hi";

const schema = yup
    .object({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    })
    .required();

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(login(data)).unwrap();

            // Check localStorage immediately
            localStorage.getItem("token");

            toast.success("Login successful!");

            // Redirect based on role
            const userRole = result.user?.role?.name || result.user?.role;

            let redirectPath = "/dashboard";
            if (userRole === "admin") {
                redirectPath = "/dashboard";
            } else if (userRole === "cashier" || userRole === "waiter") {
                redirectPath = "/pos";
            }

            // Small delay to ensure state is updated
            setTimeout(() => {
                navigate(redirectPath);
            }, 100);
        } catch (error) {
            console.error("💥 Error:", error);
            console.error("📄 Error Type:", typeof error);
            console.error("📄 Error Message:", error.message || error);
            toast.error(error.message || error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-4 shadow-lg">
                        <HiShoppingCart className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        RestoranPOS
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                        autoComplete="off"
                    >
                        {/* Username */}
                        <div>
                            <Input
                                label="Username"
                                {...register("username")}
                                error={errors.username?.message}
                                placeholder="Enter your username"
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                error={errors.password?.message}
                                placeholder="Enter your password"
                                autoComplete="off"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <HiEyeOff className="h-5 w-5" />
                                ) : (
                                    <HiEye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                            className="h-12 text-base font-semibold"
                        >
                            Sign In
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-sm mt-8">
                    © {new Date().getFullYear()} RestoranPOS. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
