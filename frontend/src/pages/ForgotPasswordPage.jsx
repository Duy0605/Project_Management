import { Mail, ArrowLeft, Bot, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import forgotPassword from "../services/authService";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState("form");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleResetPassword = async () => {
        if (!email) {
            setError("Vui lòng nhập email");
            return;
        }

        setLoading(true);
        setError("");

        const result = await forgotPassword.requestPasswordReset(email);

        setLoading(false);

        if (result.success) {
            setSuccess("success");
        } else {
            setError(result.message || "Có lỗi xảy ra");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* Card */}
            <div className="relative w-full max-w-sm p-8 bg-white shadow-xl rounded-2xl">
                {/* Back */}
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

                {/* Form nhập email */}
                {success === "form" && (
                    <>
                        <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
                            Quên mật khẩu?
                        </h2>
                        <p className="mb-6 text-sm text-center text-gray-500">
                            Đừng lo, chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại
                            mật khẩu qua email.
                        </p>

                        <div className="mb-6">
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
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Đang gửi..."
                                : "Gửi hướng dẫn đặt lại mật khẩu"}
                        </button>

                        <p className="mt-6 text-sm text-center text-gray-500">
                            Chưa có tài khoản?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="font-medium text-blue-500 hover:underline"
                            >
                                Đăng ký miễn phí
                            </button>
                        </p>
                    </>
                )}

                {/* Form check email */}
                {success === "success" && (
                    <>
                        <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
                            Quên mật khẩu?
                        </h2>
                        <p className="mb-6 text-sm text-center text-gray-500">
                            Đừng lo, chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại
                            mật khẩu qua email.
                        </p>

                        {/* Check icon */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <h3 className="mb-2 text-lg font-semibold text-center text-gray-800">
                            Kiểm tra email của bạn
                        </h3>
                        <p className="mb-4 text-sm text-center text-gray-500">
                            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến
                            <br />
                            <span className="font-medium text-gray-700">
                                {email}
                            </span>
                        </p>

                        <div className="p-4 mb-6 text-sm text-blue-700 border border-blue-200 rounded-lg bg-blue-50">
                            Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
                            <button
                                onClick={() => setSuccess("form")}
                                className="font-medium underline"
                            >
                                thử địa chỉ email khác
                            </button>
                        </div>

                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                        >
                            Quay lại đăng nhập
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

export default ForgotPasswordPage;
