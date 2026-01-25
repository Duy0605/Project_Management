import { X, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import boardService from "../services/boardService"; 

const MemberDetailPopup = ({ open, onClose, member, boardId, onRemoved }) => {
    if (!open || !member) return null;

    const user = member.user;
    const popupRef = useRef(null);

    const handleRemove = async () => {
        if (!window.confirm("Xóa thành viên khỏi bảng?")) return;

        try {
            const result = await boardService.removeMember(boardId, user._id);

            if (result.success) {
                alert(result.message || "Đã xóa thành viên");
                onRemoved?.();
                onClose(); 
            } else {
                alert(result.message || "Xóa thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra");
        }
    };

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div
                ref={popupRef}
                className="fixed w-full max-w-md p-2 text-gray-100 -translate-x-1/2 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl top-16 left-1/2"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <h3 className="text-xl font-semibold">
                        Thông tin thành viên
                    </h3>
                    <button onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                    <p className="text-sm">
                        <span className="text-gray-400">Tên:</span> {user?.name}
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400">Email:</span>{" "}
                        {user?.email}
                    </p>
                    <p className="text-sm">
                        <span className="text-gray-400">Vai trò:</span>{" "}
                        {member.role === "owner"
                            ? "Quản trị viên"
                            : "Thành viên"}
                    </p>
                </div>

                {/* Actions */}
                {member.role !== "owner" && (
                    <div className="flex p-4 border-t border-gray-700 ">
                        <button
                            onClick={handleRemove}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                        >
                            <Trash2 size={16} />
                            Xóa khỏi bảng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDetailPopup;
