import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    HiArrowLeft,
    HiPrinter,
    HiCheck,
    HiX,
    HiClock,
    HiCheckCircle,
} from "react-icons/hi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import orderService from "../../services/orderService";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import { getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await orderService.getById(id);
            console.log("=== Order Detail Response ===");
            console.log("Full Order:", response.data);
            console.log("Order Subtotal:", response.data.subtotal);
            console.log("Order Items:", response.data.order_items);
            setOrder(response.data);
        } catch (error) {
            toast.error("Failed to load order");
            console.error(error);
            navigate("/orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            setUpdating(true);
            await orderService.updateStatus(id, status);
            toast.success(`Order status updated to ${status}`);
            fetchOrder();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update status",
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            setUpdating(true);
            await orderService.cancel(id);
            toast.success("Order cancelled");
            setShowCancelModal(false);
            fetchOrder();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to cancel order",
            );
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
        toast.success("Print dialog opened");
    };

    const getStatusVariant = (status) => {
        const variants = {
            pending: "warning",
            preparing: "primary",
            ready: "success",
            completed: "success",
            cancelled: "danger",
        };
        return variants[status] || "secondary";
    };

    const canUpdateStatus = (currentStatus, newStatus) => {
        const statusFlow = {
            pending: ["preparing", "cancelled"],
            preparing: ["ready", "cancelled"],
            ready: ["completed"],
            completed: [],
            cancelled: [],
        };
        return statusFlow[currentStatus]?.includes(newStatus);
    };

    // Helper function to get role name from role_id
    const getRoleName = (roleId) => {
        const roles = {
            1: "Admin",
            2: "Cashier",
            3: "Waiter",
            4: "Kitchen Staff",
        };
        return roles[roleId] || "Unknown";
    };

    // Calculate totals - tambahkan pengecekan lebih defensive
    const calculateTotals = () => {
        console.log("=== calculateTotals Called ===");
        console.log("Order state:", order);

        if (!order) {
            console.log("Order is null/undefined, returning zeros");
            return { subtotal: 0, tax: 0, discount: 0, total: 0 };
        }

        // Get totals from order object (already calculated by backend)
        const subtotal = parseFloat(order.subtotal) || 0;
        const tax = parseFloat(order.tax) || 0;
        const discount = parseFloat(order.discount) || 0;
        const total = parseFloat(order.total) || 0;

        console.log("=== Order Totals from API ===");
        console.log("Subtotal:", subtotal);
        console.log("Tax:", tax);
        console.log("Discount:", discount);
        console.log("Total:", total);

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
        };
    };

    // Hanya hitung totals jika order sudah ada
    const totals = order
        ? calculateTotals()
        : { subtotal: 0, tax: 0, discount: 0, total: 0 };

    if (loading) {
        return <Loading fullScreen text="Loading order details..." />;
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Order not found</p>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/orders")}
                        className="mt-4"
                    >
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl print:max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/orders")}
                        className="gap-2"
                    >
                        <HiArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order #{order.order_number}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {formatDateTime(order.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge
                        variant={getStatusVariant(order.status)}
                        className="text-sm"
                    >
                        {order.status}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-2"
                    >
                        <HiPrinter className="h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">RESTAURANT POS</h1>
                <p className="text-sm text-gray-600">Order Receipt</p>
                <div className="border-t-2 border-dashed border-gray-300 my-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card title="Order Items">
                        <div className="space-y-3">
                            {order.order_items &&
                            Array.isArray(order.order_items) &&
                            order.order_items.length > 0 ? (
                                order.order_items.map((item) => {
                                    // Defensive check untuk setiap item
                                    if (!item) {
                                        console.warn(
                                            "Skipping null/undefined item",
                                        );
                                        return null;
                                    }

                                    const itemPrice =
                                        parseFloat(item.price) || 0;
                                    const itemQuantity =
                                        parseInt(item.quantity) || 0;
                                    const itemSubtotal =
                                        parseFloat(item.subtotal) ||
                                        itemPrice * itemQuantity;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                                        >
                                            {/* Image */}
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 print:hidden">
                                                <img
                                                    src={getImageUrl(
                                                        item.menu_item
                                                            ?.image_url,
                                                    )}
                                                    alt={
                                                        item.menu_item?.name ||
                                                        "Menu Item"
                                                    }
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/placeholder.png";
                                                    }}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.menu_item
                                                                ?.name ||
                                                                "Unknown Item"}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {formatCurrency(
                                                                itemPrice,
                                                            )}{" "}
                                                            × {itemQuantity}
                                                        </p>
                                                        {item.notes && (
                                                            <p className="text-sm text-gray-500 italic mt-1">
                                                                Note:{" "}
                                                                {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            itemSubtotal,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No items in this order
                                </div>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax (10%)</span>
                                <span>{formatCurrency(totals.tax)}</span>
                            </div>
                            {totals.discount > 0 && (
                                <div className="flex justify-between text-sm text-danger-600">
                                    <span>Discount</span>
                                    <span>
                                        -{formatCurrency(totals.discount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                                <span>Total</span>
                                <span>{formatCurrency(totals.total)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Status Actions */}
                    {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                            <Card
                                title="Order Actions"
                                className="print:hidden"
                            >
                                <div className="flex flex-wrap gap-3">
                                    {canUpdateStatus(
                                        order.status,
                                        "preparing",
                                    ) && (
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleUpdateStatus("preparing")
                                            }
                                            loading={updating}
                                            className="gap-2"
                                        >
                                            <HiClock className="h-5 w-5" />
                                            Start Preparing
                                        </Button>
                                    )}

                                    {canUpdateStatus(order.status, "ready") && (
                                        <Button
                                            variant="success"
                                            onClick={() =>
                                                handleUpdateStatus("ready")
                                            }
                                            loading={updating}
                                            className="gap-2"
                                        >
                                            <HiCheckCircle className="h-5 w-5" />
                                            Mark as Ready
                                        </Button>
                                    )}

                                    {canUpdateStatus(
                                        order.status,
                                        "completed",
                                    ) && (
                                        <Button
                                            variant="success"
                                            onClick={() =>
                                                handleUpdateStatus("completed")
                                            }
                                            loading={updating}
                                            className="gap-2"
                                        >
                                            <HiCheck className="h-5 w-5" />
                                            Complete Order
                                        </Button>
                                    )}

                                    {canUpdateStatus(
                                        order.status,
                                        "cancelled",
                                    ) && (
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                setShowCancelModal(true)
                                            }
                                            loading={updating}
                                            className="gap-2"
                                        >
                                            <HiX className="h-5 w-5" />
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Order Info */}
                    <Card title="Order Information">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Order Number</p>
                                <p className="font-medium text-gray-900">
                                    #{order.order_number}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">Order Type</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {order.order_type?.replace("_", " ") ||
                                        "N/A"}
                                </p>
                            </div>

                            {order.table && (
                                <div>
                                    <p className="text-gray-600">Table</p>
                                    <p className="font-medium text-gray-900">
                                        {order.table.table_number} (
                                        {order.table.location})
                                    </p>
                                </div>
                            )}

                            {order.customer_name && (
                                <div>
                                    <p className="text-gray-600">Customer</p>
                                    <p className="font-medium text-gray-900">
                                        {order.customer_name}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-600">Status</p>
                                <Badge
                                    variant={getStatusVariant(order.status)}
                                    className="mt-1"
                                >
                                    {order.status}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-gray-600">Created At</p>
                                <p className="font-medium text-gray-900">
                                    {formatDateTime(order.created_at)}
                                </p>
                            </div>

                            {order.completed_at && (
                                <div>
                                    <p className="text-gray-600">
                                        Completed At
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDateTime(order.completed_at)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Payment Info */}
                    <Card title="Payment Information">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Payment Method</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {order.payment_method?.replace("_", " ") ||
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">Total Amount</p>
                                <p className="font-bold text-lg text-gray-900">
                                    {formatCurrency(totals.total)}
                                </p>
                            </div>

                            {order.paid_amount &&
                                parseFloat(order.paid_amount) > 0 && (
                                    <div>
                                        <p className="text-gray-600">
                                            Paid Amount
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(order.paid_amount)}
                                        </p>
                                    </div>
                                )}

                            {order.change_amount &&
                                parseFloat(order.change_amount) > 0 && (
                                    <div>
                                        <p className="text-gray-600">Change</p>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(
                                                order.change_amount,
                                            )}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </Card>

                    {/* Staff Info */}
                    <Card title="Staff Information">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600">Created By</p>
                                <p className="font-medium text-gray-900">
                                    {order.user?.full_name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">Role</p>
                                <p className="font-medium text-gray-900">
                                    {order.user?.role?.name ||
                                        getRoleName(order.user?.role_id) ||
                                        "-"}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Order"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to cancel order{" "}
                        <strong>#{order.order_number}</strong>? This action
                        cannot be undone.
                    </p>
                    <div className="flex items-center gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelModal(false)}
                        >
                            No, Keep Order
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCancelOrder}
                            loading={updating}
                        >
                            Yes, Cancel Order
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Print Footer */}
            <div className="hidden print:block text-center mt-8 pt-4 border-t-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600">
                    Thank you for your order!
                </p>
            </div>
        </div>
    );
};

export default OrderDetail;
