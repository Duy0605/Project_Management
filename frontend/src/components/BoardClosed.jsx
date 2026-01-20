import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";

const BoardClosed = ({ open, onClose, boards = [], onReopen, onDelete }) => {
    const modalRef = useRef(null);

    // click ra ngoài để đóng
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

    return (
        <div className="fixed inset-0 z-50 bg-black/60">
            <div
                ref={modalRef}
                className="fixed w-full max-w-2xl p-5 text-gray-100 -translate-x-1/2 border shadow-2xl border-slate-700 bg-slate-900 rounded-xl top-16 left-1/2"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Bảng đã đóng</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 rounded hover:bg-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Danh sách board */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {boards.length === 0 && (
                        <p className="text-sm text-gray-400">
                            Không có bảng nào đã đóng
                        </p>
                    )}

                    {boards.map((board) => (
                        <div
                            key={board._id}
                            className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg"
                        >
                            {/* Info */}
                            <div className="flex items-center gap-3">
                                {/* Thumbnail */}
                                <div
                                    className={`w-10 h-7 rounded-md flex-shrink-0 ${
                                        board.background || "bg-blue-700"
                                    }`}
                                />

                                <div>
                                    <p className="text-sm font-medium text-blue-400">
                                        {board.name}
                                    </p>
                                    
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onReopen(board._id)}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Mở lại
                                </button>
                                <button
                                    onClick={() => onDelete(board._id)}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    <Trash2 size={14} />
                                    Xoá
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BoardClosed;
