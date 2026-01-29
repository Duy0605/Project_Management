import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bot } from "lucide-react";
import {
    FiHome,
    FiTrello,
    FiBriefcase,
    FiChevronDown,
    FiHelpCircle,
    FiUsers,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { avatar } from "../utils/avatar";

const Sidebar = () => {
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
    const { user } = useAuth();

    const mainMenuItems = [
        { icon: FiHome, label: "Trang chủ", path: "/home" },
        { icon: FiTrello, label: "Bảng dự án", path: "/board" },
    ];

    const workspaceItems = [
        { icon: FiTrello, label: "Bảng dự án của tôi", path: "/personal-boards" },
        { icon: FiUsers, label: "Thành viên", path: "/members" },
    ];

    return (
        <aside className="flex flex-col w-64 h-screen text-white bg-slate-900">
            {/* User Info */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full ${
                            user?.avatarColor ||
                            "bg-gradient-to-br from-blue-500 to-blue-700"
                        }`}
                    >
                        {avatar(user?.name)}
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-400">
                            {user?.email || ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {mainMenuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 pl-4 hover:bg-slate-800 rounded-xl border-b-4 border-slate-900 transition ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300"
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
                {/* Workspace Section */}
                <div className="mb-1">
                    {/* Workspace Header - Clickable */}
                    <button
                        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 transition hover:bg-slate-800"
                    >
                        <div className="flex items-center gap-3">
                            <FiBriefcase className="w-5 h-5" />
                            <span>Không gian làm việc</span>
                        </div>
                        <FiChevronDown
                            className={`w-4 h-4 transition-transform ${
                                isWorkspaceOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Workspace Sub-items */}
                    {isWorkspaceOpen && (
                        <div className="p-1 m-1">
                            {workspaceItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 pl-12 hover:bg-slate-800 rounded-xl border-b-4 border-slate-900 transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-400"
                                        }`
                                    }
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-sm">
                                        {item.label}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
                {/* Hỏi AI
                <NavLink
                    to="/ask-ai"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 pl-4 hover:bg-slate-800 rounded-xl border-b-4 border-slate-900 transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300"
                                        }`
                    }
                >
                    <FiHelpCircle className="w-5 h-5" />
                    <span>Hỏi AI</span>
                </NavLink>{" "} */}
            </nav>
        </aside>
    );
};

export default Sidebar;
