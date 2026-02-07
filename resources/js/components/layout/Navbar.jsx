import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { HiMenu, HiX, HiBell, HiUser, HiLogout, HiCog } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [notifications] = useState([
        {
            id: 1,
            message: "New order received",
            time: "2 min ago",
            unread: true,
        },
        {
            id: 2,
            message: "Table 5 needs attention",
            time: "10 min ago",
            unread: true,
        },
        {
            id: 3,
            message: "Low stock alert: Coca Cola",
            time: "1 hour ago",
            unread: false,
        },
    ]);

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30 top-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? (
                                <HiX className="h-6 w-6" />
                            ) : (
                                <HiMenu className="h-6 w-6" />
                            )}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center ml-4 lg:ml-0">
                            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="h-6 w-6 text-white"
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
                            <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                                RestoranPOS
                            </span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                                <HiBell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-4 w-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <Menu.Item key={notification.id}>
                                                {({ active }) => (
                                                    <div
                                                        className={`px-4 py-3 border-b border-gray-100 ${
                                                            active
                                                                ? "bg-gray-50"
                                                                : ""
                                                        } ${notification.unread ? "bg-primary-50" : ""}`}
                                                    >
                                                        <p className="text-sm text-gray-900">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-gray-200">
                                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                            View all notifications
                                        </button>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User menu */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-gray-100"
                                                            : ""
                                                    } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700`}
                                                >
                                                    <HiUser className="mr-3 h-5 w-5" />
                                                    Profile
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active
                                                            ? "bg-gray-100"
                                                            : ""
                                                    } group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700`}
                                                >
                                                    <HiCog className="mr-3 h-5 w-5" />
                                                    Settings
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="p-2 border-t border-gray-200">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={logout}
                                                    className={`${
                                                        active
                                                            ? "bg-danger-50 text-danger-700"
                                                            : "text-danger-600"
                                                    } group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium`}
                                                >
                                                    <HiLogout className="mr-3 h-5 w-5" />
                                                    Logout
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
