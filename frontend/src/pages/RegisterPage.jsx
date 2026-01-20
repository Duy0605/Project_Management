import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setLoading(true);

        try {
            const result = await register(
                name,
                email,
                password,
                confirmPassword
            );

            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
            console.error("Register error:", err);
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
                    Đăng ký
                </h2>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Họ và tên"
                                disabled={loading}
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                disabled={loading}
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                disabled={loading}
                                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute -translate-y-1/2 right-3 top-1/2"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <Eye className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-8">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Xác nhận mật khẩu{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Xác nhận mật khẩu"
                                disabled={loading}
                                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute -translate-y-1/2 right-3 top-1/2"
                            >
                                {showConfirmPassword ? (
                                    <Eye className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Create account */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                Đang đăng ký...
                            </span>
                        ) : (
                            "Tạo tài khoản"
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

                {/* Login */}
                <p className="mt-6 text-sm text-center text-gray-500">
                    Đã có tài khoản?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-medium text-blue-500 hover:underline"
                        disabled={loading}
                    >
                        Đăng nhập
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

export default RegisterPage;
