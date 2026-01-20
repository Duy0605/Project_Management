import { X } from "lucide-react";
import { useState } from "react";
import boardService from "../services/boardService";
import aiService from "../services/aiService";

const CreateBoard = ({ open, onClose, onCreate }) => {
    const [title, setTitle] = useState("");
    const [background, setBackground] = useState("bg-blue-700");
    const [enableAI, setEnableAI] = useState(false);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const backgrounds = [
        "bg-blue-700",
        "bg-sky-500",
        "bg-indigo-600",
        "bg-purple-600",
        "bg-gradient-to-r from-violet-500 to-fuchsia-500",
        "bg-gradient-to-r from-blue-500 to-purple-600",
    ];

    if (!open) return null;

    const handleCreate = async () => {
        if (!title.trim()) {
            setError("Tiêu đề bảng không được để trống");
            return;
        }

        if (enableAI && !description.trim()) {
            setError("Vui lòng nhập mô tả khi bật AI");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Gọi API tạo board
            const result = await boardService.createBoard({
                name: title.trim(),
                description: description.trim(),
                background: background,
            });

            if (result.success) {
                onCreate?.(result.data);

                // Nếu bật AI thì gọi API tạo cấu trúc ngay sau khi tạo board
                if (enableAI && description.trim()) {
                    try {
                        const boardId = result.data._id || result.data.id;
                        const aiRes = await aiService.generateBoardStructure(
                            boardId,
                            description.trim(),
                            false,
                        );

                        if (aiRes.success) {
                            const created =
                                aiRes.data.columns || aiRes.data.columns || [];
                            if (created.length > 0) {
                                // Thông báo đơn giản cho người dùng
                                alert(
                                    `AI đã tạo ${created.length} cột cho bảng.`,
                                );
                            }
                        } else {
                            console.error("AI error:", aiRes.error);
                            // Không chặn việc tạo board, chỉ cảnh báo
                            alert(
                                "Không thể tạo cấu trúc bằng AI. Vui lòng thử lại sau.",
                            );
                        }
                    } catch (err) {
                        console.error("AI generate error:", err);
                        alert("Lỗi khi gọi AI. Vui lòng thử lại sau.");
                    }
                }

                setTitle("");
                setBackground("bg-blue-700");
                setDescription("");
                setEnableAI(false);
                onClose();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
            console.error("Lỗi tạo bảng:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-md overflow-hidden text-gray-100 bg-gray-800 w-80 rounded-xl">
                {/* Header */}
                <div className="relative flex items-center px-4 py-3 border-b border-neutral-700">
                    <h2 className="absolute text-lg font-semibold -translate-x-1/2 left-1/2">
                        Tạo bảng
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 ml-auto rounded hover:bg-neutral-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="px-4 pt-4">
                        <div className="p-3 text-sm text-red-200 bg-red-900 border border-red-700 rounded">
                            {error}
                        </div>
                    </div>
                )}

                {/* Preview */}
                <div
                    className={`h-28 ${background} m-4 rounded-lg flex items-center justify-center`}
                >
                    <div className="flex gap-2">
                        <div className="w-16 h-20 rounded bg-white/80" />
                        <div className="w-16 h-20 rounded bg-white/80" />
                        <div className="w-16 h-20 rounded bg-white/80" />
                    </div>
                </div>

                {/* Chọn bg */}
                <div className="px-4">
                    <p className="mb-2 text-sm font-medium">Phông nền</p>
                    <div className="flex flex-wrap gap-2">
                        {backgrounds.map((bg, index) => (
                            <button
                                key={index}
                                onClick={() => setBackground(bg)}
                                className={`w-10 h-10 rounded ${bg} ${
                                    background === bg ? "ring-2 ring-white" : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="px-4 mt-4">
                    <label className="block mb-1 text-sm font-medium">
                        Tiêu đề bảng <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-white border rounded bg-neutral-800 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Nhập tiêu đề bảng"
                    />
                    {title.trim() === "" && (
                        <p className="mt-1 text-xs text-gray-400">
                            👋 Tiêu đề bảng là bắt buộc
                        </p>
                    )}
                </div>

                {/* AI Toggle */}
                <div className="px-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Hỗ trợ AI</label>

                        {/* Toggle */}
                        <button
                            onClick={() => setEnableAI(!enableAI)}
                            className={`w-12 h-6 flex items-center rounded-full transition ${
                                enableAI ? "bg-blue-500" : "bg-neutral-600"
                            }`}
                        >
                            <span
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                                    enableAI ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        Bật AI để hệ thống tự động gợi ý cấu trúc bảng
                    </p>

                    {/* Description */}
                    <div className="mt-2">
                        <label className="block mb-1 text-sm font-medium">
                            Mô tả dự án
                            {enableAI && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Mô tả ngắn gọn về dự án để AI hỗ trợ tốt hơn"
                            className={`w-full px-3 py-2 text-sm text-white border rounded bg-neutral-800 border-neutral-700 transition-all duration-300 ${
                                enableAI ? "ring-1 ring-blue-300" : ""
                            }`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-4 mt-4 border-t border-neutral-700">
                    <button
                        onClick={handleCreate}
                        disabled={
                            loading ||
                            !title.trim() ||
                            (enableAI && !description.trim())
                        }
                        className={`w-full py-2 rounded font-medium transition flex items-center justify-center gap-2 ${
                            title.trim() &&
                            (!enableAI || description.trim()) &&
                            !loading
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-neutral-700 cursor-not-allowed"
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo mới"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBoard;
