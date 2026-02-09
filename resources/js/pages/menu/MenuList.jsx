import React, { useEffect, useState } from "react";
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiSearch,
    HiFilter,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import MenuForm from "./MenuForm";
import menuService from "../../services/menuService";
import categoryService from "../../services/categoryService";
import { formatCurrency } from "../../utils/formatters";
import { getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const MenuList = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Default 4 items per page

    useEffect(() => {
        fetchData();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [menuRes, categoryRes] = await Promise.all([
                menuService.getAll(),
                categoryService.getAll(),
            ]);
            setMenuItems(menuRes.data || []);
            setCategories(categoryRes.data || []);
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedMenu(null);
        setIsModalOpen(true);
    };

    const handleEdit = (menu) => {
        setSelectedMenu(menu);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await menuService.delete(id);
            toast.success("Menu item deleted successfully");
            fetchData();
            setDeleteConfirm(null);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete menu item",
            );
        }
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setSelectedMenu(null);
        fetchData();
    };

    // Filter menu items
    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            item.category_id === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMenuItems.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    // Pagination handlers
    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <Loading fullScreen text="Loading menu items..." />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Menu Items
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your restaurant menu ({filteredMenuItems.length}{" "}
                        items)
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    className="gap-2"
                >
                    <HiPlus className="h-5 w-5" />
                    Add Menu Item
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input pl-10"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="form-input pl-10"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((item) => (
                    <Card
                        key={item.id}
                        className="hover:shadow-lg transition-shadow"
                        noPadding
                    >
                        {/* Image */}
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                            <img
                                src={getImageUrl(item.image_url)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/images/placeholder.png";
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Title & Category */}
                            <div>
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <Badge
                                        variant={
                                            item.is_available
                                                ? "success"
                                                : "secondary"
                                        }
                                        size="sm"
                                    >
                                        {item.is_available
                                            ? "Available"
                                            : "Unavailable"}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {item.category?.name}
                                </p>
                            </div>

                            {/* Description */}
                            {item.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="text-lg font-bold text-primary-600">
                                {formatCurrency(item.price)}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 gap-2"
                                >
                                    <HiPencil className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setDeleteConfirm(item)}
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
            {filteredMenuItems.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <HiSearch className="h-full w-full" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            No menu items found
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by creating a new menu item"}
                        </p>
                    </div>
                </Card>
            )}

            {/* Pagination */}
            {filteredMenuItems.length > 0 && totalPages > 1 && (
                <Card>
                    <div className="flex items-center justify-between">
                        {/* Showing info */}
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} to{" "}
                            {Math.min(
                                indexOfLastItem,
                                filteredMenuItems.length,
                            )}{" "}
                            of {filteredMenuItems.length} items
                        </div>

                        {/* Pagination controls */}
                        <div className="flex items-center gap-2">
                            {/* Previous button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="gap-1"
                            >
                                <HiChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;

                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 &&
                                            pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() =>
                                                    goToPage(pageNumber)
                                                }
                                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                                    currentPage === pageNumber
                                                        ? "bg-primary-600 text-white font-semibold"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return (
                                            <span
                                                key={pageNumber}
                                                className="px-2 text-gray-400"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Next button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="gap-1"
                            >
                                Next
                                <HiChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMenu(null);
                }}
                title={selectedMenu ? "Edit Menu Item" : "Create Menu Item"}
                size="lg"
            >
                <MenuForm
                    menuItem={selectedMenu}
                    categories={categories}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedMenu(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Menu Item"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete{" "}
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

export default MenuList;
