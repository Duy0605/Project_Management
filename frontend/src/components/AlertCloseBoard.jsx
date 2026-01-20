import { useEffect, useRef } from "react";
import { X, Archive } from "lucide-react";

const CloseBoard = ({ open, onClose, board, onConfirm }) => {
    const modalRef = useRef(null);

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
        <div className="fixed inset-0 z-50 flex bg-black/60">
            <div
                ref={modalRef}
                className="fixed w-full max-w-sm p-6 m-auto text-gray-100 -translate-x-1/2 border shadow-2xl border-slate-700 bg-slate-900 rounded-xl top-16 left-1/2"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Archive size={20} className="text-red-400" />
                        <h2 className="text-lg font-semibold">Đóng bảng</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 rounded hover:bg-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6 space-y-3">
                    <p className="text-sm text-gray-300">
                        Bạn có chắc muốn đóng bảng{" "}
                        <span className="font-semibold text-blue-400">
                            "{board?.name}"
                        </span>
                        ?
                    </p>
                    <p className="text-xs text-gray-400">
                        Bảng sẽ được lưu trữ và bạn có thể mở lại bất cứ lúc nào
                        từ danh sách "Các bảng đã đóng".
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 rounded bg-slate-700 hover:bg-slate-600"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm text-white transition rounded bg-slate-800 hover:bg-red-600"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseBoard;
