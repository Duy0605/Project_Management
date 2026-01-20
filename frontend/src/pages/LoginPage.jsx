import { Mail, Lock, Eye, EyeOff, Bot } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Vui lòng điền đầy đủ email và mật khẩu.");
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate("/home");
            } else {
                setError(
                    result.message || "Đăng nhập thất bại. Vui lòng thử lại."
                );
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800">
            {/* Card */}
            <div className="w-full max-w-sm p-8 bg-white shadow-xl rounded-2xl">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
                    Đăng nhập
                </h2>

                {/* Error Message */}
                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                disabled={loading}
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>

                        <div className="relative">
                            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                placeholder="Nhập mật khẩu"
                                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />

                            {/* Eye / EyeOff */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute -translate-y-1/2 right-3 top-1/2"
                            >
                                {showPassword ? (
                                    <Eye className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center gap-2 text-sm text-gray-500">
                            <input type="checkbox" className="rounded" />
                            Ghi nhớ đăng nhập
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-blue-500 hover:underline"
                            disabled={loading}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Đăng nhập */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                Đang đăng nhập...
                            </span>
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">
                        Hoặc tiếp tục với
                    </span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Signup */}
                <p className="mt-6 text-sm text-center text-gray-500">
                    Chưa có tài khoản?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="font-medium text-blue-500 hover:underline"
                        disabled={loading}
                    >
                        Đăng ký miễn phí
                    </button>
                </p>
            </div>

            {/* Footer */}
            <p className="mt-6 text-sm text-gray-300">
                © 2025 Project Management. All rights reserved.
            </p>
        </div>
    );
};

export default LoginPage;
