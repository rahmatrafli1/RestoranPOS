import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";

const schema = yup
    .object({
        name: yup
            .string()
            .required("Name is required")
            .max(100, "Name must be less than 100 characters"),
        description: yup.string().nullable(),
        display_order: yup.number().nullable().min(0, "Order must be positive"),
        is_active: yup.boolean(),
    })
    .required();

const CategoryForm = ({ category, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            display_order: 0,
            is_active: true,
        },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                description: category.description || "",
                display_order: category.display_order || 0,
                is_active:
                    category.is_active !== undefined
                        ? category.is_active
                        : true,
            });
        }
    }, [category, reset]);

    const onSubmit = async (data) => {
        try {
            if (category) {
                await categoryService.update(category.id, data);
                toast.success("Category updated successfully");
            } else {
                await categoryService.create(data);
                toast.success("Category created successfully");
            }
            onSuccess();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to save category",
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <Input
                    label="Category Name"
                    {...register("name")}
                    error={errors.name?.message}
                    placeholder="e.g., Beverages"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="form-label">Description</label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="form-input"
                    placeholder="Enter category description (optional)"
                />
                {errors.description && (
                    <p className="form-error">{errors.description.message}</p>
                )}
            </div>

            {/* Display Order */}
            <div>
                <Input
                    label="Display Order"
                    type="number"
                    {...register("display_order")}
                    error={errors.display_order?.message}
                    placeholder="0"
                    helperText="Lower numbers appear first"
                />
            </div>

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
                    Active
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
                    {category ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
};

export default CategoryForm;
