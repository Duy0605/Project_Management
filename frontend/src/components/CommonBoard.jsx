import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import boardService from "../services/boardService";

const CommonBoard = ({ open, onClose, member, buttonRef }) => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (open && member) {
            fetchCommonBoards();
            calculatePosition();
        }
    }, [open, member]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef?.current &&
                !buttonRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose, buttonRef]);

    const calculatePosition = () => {
        if (buttonRef?.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
    };

    const fetchCommonBoards = async () => {
        let loadingTimer;
        loadingTimer = setTimeout(() => {
            setLoading(true);
        }, 300);

        try {
            const result = await boardService.getCommonBoards(member.id);
            if (result.success) {
                setBoards(result.data);
            }
        } catch (error) {
            console.error("Fetch common boards error:", error);
        } finally {
            clearTimeout(loadingTimer);
            setLoading(false);
        }
    };

    const handleBoardClick = (boardId) => {
        navigate(`/task/${boardId}`);
        onClose();
    };

    if (!open) return null;

    return (
        <div
            ref={dropdownRef}
            className="fixed z-50 w-64 overflow-hidden text-gray-100 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl"
            style={{ top: `${position.top}px`, right: `${position.right}px` }}
        >
            {/* Content */}
            <div className="py-2">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                ) : boards.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400">
                        <p className="text-sm">Không có bảng chung</p>
                    </div>
                ) : (
                    <div>
                        {boards.map((board) => (
                            <div
                                key={board.id}
                                onClick={() => handleBoardClick(board.id)}
                                className="flex items-center gap-3 px-4 transition cursor-pointer py-1.5 hover:bg-slate-700"
                            >
                                <div
                                    className={`w-10 h-7 rounded-md flex-shrink-0 ${
                                        board.background || "bg-blue-700"
                                    }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-100">
                                        {board.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonBoard;
