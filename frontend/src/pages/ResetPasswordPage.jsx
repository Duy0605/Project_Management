import { Lock, ArrowLeft, Bot, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import forgotPassword from "../services/authService";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const [step, setStep] = useState("form");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Link đặt lại mật khẩu không hợp lệ
            </div>
        );
    }
    const handleResetPassword = async () => {
        if (loading) return;

        setError("");

        if (!password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);

        const result = await forgotPassword.resetPassword(
            token,
            password,
            confirmPassword,
        );

        setLoading(false);

        if (result.success) {
            setStep("success");
            
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } else {
            setError(result.message || "Có lỗi xảy ra");
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <div className="relative w-full max-w-sm p-8 bg-white shadow-xl rounded-2xl">
                {/* nút quay lại */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <Bot className="text-white w-7 h-7" />
                    </div>
                </div>

                {step === "form" && (
                    <>
                        <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
                            Đặt lại mật khẩu
                        </h2>
                        <p className="mb-6 text-sm text-center text-gray-500">
                            Nhập mật khẩu mới cho tài khoản của bạn.
                        </p>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="mb-4 text-sm text-center text-red-500">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                        </button>
                    </>
                )}

                {step === "success" && (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
                            Đặt lại mật khẩu thành công
                        </h3>
                        <p className="mb-6 text-sm text-center text-gray-500">
                            Bạn có thể đăng nhập bằng mật khẩu mới.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                        >
                            Đăng nhập
                        </button>
                    </>
                )}
            </div>

            {/* Footer */}
            <p className="mt-6 text-sm text-gray-300">
                © 2025 ProjectAI. All rights reserved.
            </p>
        </div>
    );
};

export default ResetPasswordPage;
