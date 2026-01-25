import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { Info, UserPlus, Archive } from "lucide-react";
import DetailBoard from "./DetailBoard";
import CloseBoard from "./AlertCloseBoard";
import boardService from "../services/boardService";
import MemberPopup from "./MemberPopup";

const BoardMenu = ({ open, onClose, board, buttonRef, onBoardUpdate }) => {
    const menuRef = useRef(null);
    const [menuStyle, setMenuStyle] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Tính vị trí menu
    useLayoutEffect(() => {
        if (!open || !buttonRef?.current || !menuRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();

        const spaceRight = window.innerWidth - buttonRect.right;
        const spaceLeft = buttonRect.left;

        let style = {
            position: "fixed",
            top: buttonRect.bottom + 8,
        };

        if (spaceRight >= menuRect.width) {
            style.left = buttonRect.left;
        } else if (spaceLeft >= menuRect.width) {
            style.right = window.innerWidth - buttonRect.right;
        } else {
            style.left = Math.max(8, window.innerWidth - menuRect.width - 8);
        }
        setMenuStyle(style);
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef?.current &&
                !buttonRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    return (
        <>
            {open && (
                <div
                    ref={menuRef}
                    style={menuStyle}
                    className="z-50 py-2 overflow-hidden text-gray-100 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-52"
                >
                    <button
                        onClick={() => {
                            setShowDetail(true);
                            onClose();
                        }}
                        className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                    >
                        <Info size={18} />
                        <span>Xem thông tin bảng</span>
                    </button>

                    <div className="border-t border-gray-700 " />

                    <button
                        onClick={() => {
                            setShowMembers(true);
                            onClose();
                        }}
                        className="flex items-center w-full gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                    >
                        <UserPlus size={18} />
                        <span>Thành viên</span>
                    </button>

                    {board?.role === "owner" && (
                        <>
                            <div className="my-1 border-t border-gray-700" />
                            <button
                                onClick={() => {
                                    setShowCloseConfirm(true);
                                    onClose();
                                }}
                                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            >
                                <Archive size={18} />
                                <span>Đóng bảng</span>
                            </button>
                        </>
                    )}
                </div>
            )}
            <DetailBoard
                open={showDetail}
                onClose={() => setShowDetail(false)}
                board={board}
                onSave={async (updatedData) => {
                    try {
                        const boardId = board._id || board.id;
                        const result = await boardService.updateBoard(boardId, {
                            name: updatedData.name,
                            description: updatedData.description,
                        });

                        if (result.success) {
                            alert(result.message || "Cập nhật thành công!");
                            // Gọi callback để refresh board data
                            onBoardUpdate?.();
                        } else {
                            alert(result.message || "Cập nhật thất bại");
                        }
                    } catch (error) {
                        console.error("Update board error:", error);
                        alert("Có lỗi xảy ra khi cập nhật");
                    }
                }}
            />

            <MemberPopup
                open={showMembers}
                onClose={() => setShowMembers(false)}
                board={board}
                onMemberChange={() => {
                    onBoardUpdate?.();
                }}
            />

            <CloseBoard
                open={showCloseConfirm}
                onClose={() => setShowCloseConfirm(false)}
                board={board}
                onConfirm={async () => {
                    try {
                        const boardId = board._id || board.id;
                        const result = await boardService.closeBoard(boardId);
                        if (result.success) {
                            alert(result.message || "Đóng bảng thành công!");
                            onBoardUpdate?.();
                        } else {
                            alert(result.message || "Đóng bảng thất bại");
                        }
                    } catch (error) {
                        console.error("Close board error:", error);
                        alert("Có lỗi xảy ra khi đóng bảng");
                    }
                }}
            />
        </>
    );
};

export default BoardMenu;
