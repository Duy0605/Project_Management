import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import boardService from "../services/boardService.js";

const DetailBoard = ({ open, onClose, board, onSave }) => {
    const modalRef = useRef(null);

    const [boardDetail, setBoardDetail] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [aiEnabled, setAiEnabled] = useState(false);

    // Lấy chi tiết board khi mở modal
    useEffect(() => {
        if (!open || !board?.id) return;

        const fetchBoardDetail = async () => {
            const res = await boardService.getBoardById(board.id);
            if (res.success) {
                setBoardDetail(res.data);
                setName(res.data.name || "");
                setDescription(res.data.description || "");
                setAiEnabled(!!res.data.aiEnabled);
            }
        };

        fetchBoardDetail();
    }, [open, board]);

    // Click ra ngoài thì đóng
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleSave = () => {
        onSave?.({
            name,
            description,
            aiEnabled,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60">
            <div
                ref={modalRef}
                className="fixed w-full max-w-md p-5 text-gray-100 -translate-x-1/2 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl top-16 left-1/2"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Chi tiết bảng</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 rounded hover:bg-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tên bảng */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm text-gray-400">
                        Tên bảng
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên bảng..."
                    />
                </div>

                {/* Quản trị viên */}
                <div className="mb-4 text-sm text-gray-400">
                    <span className="mr-1">Quản trị viên:</span>
                    <span className="font-medium text-gray-100">
                        {boardDetail?.ownerId?.name || "Đang tải..."}
                    </span>
                </div>

                {/* Mô tả */}
                <div className="mb-5">
                    <label className="block mb-1 text-sm text-gray-400">
                        Mô tả bảng
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm text-gray-100 bg-gray-800 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả cho bảng..."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailBoard;
