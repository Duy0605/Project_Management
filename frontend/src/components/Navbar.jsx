import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiUser, FiLogOut, FiActivity, FiLock } from "react-icons/fi";
import { Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { avatar } from "../utils/avatar";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // State quản lý user menu
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Ref để xử lý click ngoài user menu
    const userMenuRef = useRef(null);

    // Đóng menu khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-800 shadow-sm bg-slate-900">
            {/* Logo */}
            <NavLink to="/home" className="flex items-center gap-2">
                <Bot className="w-8 h-8 text-blue-600" />
                <span className="text-lg font-bold text-gray-100">
                    Project Manager
                </span>
            </NavLink>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
                <button
                    className="flex items-center gap-3 transition hover:opacity-80"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <div
                        className={`flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full ${
                            user?.avatarColor ||
                            "bg-gradient-to-br from-blue-500 to-blue-700"
                        }`}
                    >
                        {avatar(user?.name)}
                    </div>
                    <span className="font-medium text-gray-100">
                        {user?.name || "User"}
                    </span>
                </button>

                {/* Dropdown user menu */}
                {showUserMenu && (
                    <div className="absolute right-0 w-56 py-2 mt-2 overflow-hidden border rounded-lg shadow-xl border-slate-700 bg-slate-800">
                        <div className="px-4 py-3 border-b border-slate-700">
                            <p className="font-medium text-gray-100">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.email || ""}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                navigate("/profile");
                                setShowUserMenu(false);
                            }}
                            className="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-100 transition hover:bg-slate-700"
                        >
                            <FiUser />
                            <span>Hồ sơ</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/activities");
                                setShowUserMenu(false);
                            }}
                            className="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-100 transition hover:bg-slate-700"
                        >
                            <FiActivity />
                            <span>Hoạt động gần đây</span>
                        </button>

                        <button
                            onClick={() => {
                                navigate("/change-password");
                                setShowUserMenu(false);
                            }}
                            className="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-100 transition hover:bg-slate-700"
                        >
                            <FiLock />
                            <span>Đổi mật khẩu</span>
                        </button>

                        <hr className="my-2 border-slate-700" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-3 px-4 py-2 text-left text-gray-100 transition hover:bg-slate-700"
                        >
                            <FiLogOut />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
