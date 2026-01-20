import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.name || "");
            setEmail(user.email || "");
            setBio(user.bio || "");
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) {
            alert("Vui lòng nhập họ tên");
            return;
        }

        setSaving(true);

        const result = await userService.updateProfile({
            name: fullName.trim(),
            bio: bio.trim(),
        });

        setSaving(false);

        if (result.success) {
            updateUser(result.data);
            alert("Lưu thay đổi thành công");
        } else {
            alert(result.message || "Có lỗi xảy ra");
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-400">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen text-gray-200 bg-slate-900">
            {/* Content */}
            <main className="flex-1 px-16 py-10">
                <h1 className="mb-6 text-3xl font-semibold">
                    Thông tin cá nhân
                </h1>

                {/* Họ tên */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">
                            Tên người dùng{" "}
                        </label>
                    </div>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 text-gray-100 border rounded-md bg-slate-800 border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">Email</label>
                    </div>
                    <div className="w-full px-4 py-2 text-gray-400 border rounded-md border-slate-600">
                        {email}
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-md">Lý lịch</label>
                    </div>
                    <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2 text-gray-100 border rounded-md resize-none bg-slate-800 border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Button */}
                <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex items-center justify-between gap-2 px-6 py-2 text-sm font-medium text-gray-100 transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    Lưu
                </button>
            </main>
        </div>
    );
};

export default ProfilePage;
