import { useState } from "react";
import userService from "../services/userService";

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        setSaving(true);

        const result = await userService.changePassword({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        setSaving(false);

        if (result.success) {
            alert("Đổi mật khẩu thành công");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            alert(result.message || "Đổi mật khẩu thất bại");
        }
    };

    return (
        <div className="flex min-h-screen text-gray-100 bg-slate-900">
            {/* Content */}
            <main className="flex-1 py-10 pl-32">
                <h1 className="mb-6 text-3xl font-semibold">Đổi mật khẩu</h1>

                {/* Mật khẩu hiện tại */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">
                            Mật khẩu hiện tại
                        </label>
                    </div>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-2/3 px-4 py-2 text-gray-100 border rounded-md bg-slate-800 border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                </div>

                {/* Mật khẩu mới */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">
                            Mật khẩu mới
                        </label>
                    </div>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-2/3 px-4 py-2 text-gray-100 border rounded-md bg-slate-800 border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">
                            Xác nhận mật khẩu mới
                        </label>
                    </div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-2/3 px-4 py-2 text-gray-100 border rounded-md bg-slate-800 border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Xác nhận mật khẩu mới"
                    />
                </div>

                {/* Button */}
                <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex items-center justify-between gap-2 px-6 py-2 text-sm font-medium text-gray-100 transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Đang lưu..." : "Thay đổi mật khẩu"}
                </button>
            </main>
        </div>
    );
};

export default ChangePasswordPage;
