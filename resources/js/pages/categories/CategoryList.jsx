import React, { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import CategoryForm from "./CategoryForm";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll();
            setCategories(response.data || []);
        } catch (error) {
            toast.error("Failed to load categories");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            toast.success("Category deleted successfully");
            fetchCategories();
            setDeleteConfirm(null);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete category",
            );
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        fetchCategories();
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (loading) {
        return <Loading fullScreen text="Loading categories..." />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Categories
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage menu categories
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    className="gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <Card>
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
            </Card>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                    <Card
                        key={category.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <div className="space-y-4">
                            {/* Category Info */}
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {category.name}
                                    </h3>
                                    <Badge
                                        variant={
                                            category.is_active
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {category.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                                {category.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">
                                        {category.menu_items_count || 0}
                                    </span>
                                    <span className="ml-1">Items</span>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        #{category.display_order || 0}
                                    </span>
                                    <span className="ml-1">Order</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(category)}
                                    className="flex-1 gap-2"
                                >
                                    <HiPencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setDeleteConfirm(category)}
                                    className="flex-1 gap-2"
                                >
                                    <HiTrash className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <HiSearch className="h-full w-full" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            No categories found
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchTerm
                                ? "Try adjusting your search"
                                : "Get started by creating a new category"}
                        </p>
                    </div>
                </Card>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                title={selectedCategory ? "Edit Category" : "Create Category"}
                size="md"
            >
                <CategoryForm
                    category={selectedCategory}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedCategory(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Category"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete category{" "}
                        <strong>{deleteConfirm?.name}</strong>? This action
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

export default CategoryList;
