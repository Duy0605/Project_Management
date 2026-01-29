import { FiClock, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateBoard from "../components/CreateBoard";
import BoardCard from "../components/BoardCard";
import BoardClosed from "../components/BoardClosed";
import boardService from "../services/boardService";

const BoardPage = () => {
    const navigate = useNavigate();
    const [openCreateBoard, setOpenCreateBoard] = useState(false);
    const [openClosedBoards, setOpenClosedBoards] = useState(false);

    // State quản lý boards từ API
    const [myBoards, setMyBoards] = useState([]);
    const [recentBoards, setRecentBoards] = useState([]);
    const [guestBoards, setGuestBoards] = useState([]);
    const [closedBoards, setClosedBoards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const [allBoardsResult, recentBoardsResult] = await Promise.all([
                boardService.getAllBoards(),
                boardService.getRecentBoards(),
            ]);

            if (allBoardsResult.success) {
                const allBoards = allBoardsResult.data;

                // Phân loại boards theo role
                const ownerBoards = allBoards.filter(
                    (board) => board.role === "owner",
                );
                const memberBoards = allBoards.filter(
                    (board) => board.role === "member",
                );

                setMyBoards(ownerBoards);
                setGuestBoards(memberBoards);
            }

            if (recentBoardsResult.success) {
                setRecentBoards(recentBoardsResult.data);
            }
        } catch (error) {
            console.error("Fetch boards error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClosedBoards = async () => {
        try {
            const result = await boardService.getClosedBoards();
            if (result.success) {
                setClosedBoards(result.data);
            }
        } catch (error) {
            console.error("Fetch closed boards error:", error);
        }
    };

    const handleReopenBoard = async (boardId) => {
        try {
            const result = await boardService.reopenBoard(boardId);
            if (result.success) {
                alert("Mở lại bảng thành công!");
                fetchClosedBoards();
                fetchBoards();
            } else {
                alert(result.message || "Mở lại bảng thất bại");
            }
        } catch (error) {
            console.error("Reopen board error:", error);
            alert("Có lỗi xảy ra khi mở lại bảng");
        }
    };

    const handleDeleteBoard = async (boardId) => {
        if (!window.confirm("Bạn có chắc muốn xóa vĩnh viễn bảng này?")) return;

        try {
            const result = await boardService.deleteBoard(boardId);
            if (result.success) {
                alert("Xóa bảng thành công!");
                fetchClosedBoards();
            } else {
                alert(result.message || "Xóa bảng thất bại");
            }
        } catch (error) {
            console.error("Delete board error:", error);
            alert("Có lỗi xảy ra khi xóa bảng");
        }
    };

    const handleBoardCreated = (newBoard) => {
        setMyBoards([newBoard, ...myBoards]);

        console.log("✅ Board created:", newBoard);
    };

    const sections = [
        {
            title: "Đã xem gần đây",
            icon: <FiClock />,
            boards: recentBoards,
        },
        {
            title: "Các Dự án của tôi",
            boards: myBoards,
            showCreate: true,
        },
        {
            title: "Các dự án tôi tham gia",
            icon: <FiInfo />,
            boards: guestBoards,
        },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="py-8 space-y-10 text-gray-100 px-14">
                {sections.map((section) => {
                    // Ẩn section "Đã xem gần đây" nếu không có board nào
                    if (
                        section.title === "Đã xem gần đây" &&
                        section.boards.length === 0
                    ) {
                        return null;
                    }

                    if (
                        section.title === "Các dự án của khách" &&
                        section.boards.length === 0
                    ) {
                        return null;
                    }

                    return (
                        <section key={section.title}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {section.icon}
                                    <h2 className="text-lg font-semibold uppercase">
                                        {section.title}
                                    </h2>
                                </div>

                                {section.showCreate && (
                                    <div className="flex gap-2 text-sm">
                                        <button
                                            onClick={() =>
                                                navigate("/personal-boards")
                                            }
                                            className="px-3 py-1 text-gray-100 rounded bg-slate-700 hover:bg-slate-600"
                                        >
                                            Bảng dự án của tôi
                                        </button>
                                        <button
                                            onClick={() => navigate("/members")}
                                            className="px-3 py-1 text-gray-100 rounded bg-slate-700 hover:bg-slate-600"
                                        >
                                            Thành viên
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 border-b border-slate-800"></div>

                            {/* No Boards Message */}
                            {section.boards.length === 0 &&
                                !section.showCreate && (
                                    <div className="py-8 text-center text-gray-400">
                                        <p>Chưa có bảng dự án nào</p>
                                    </div>
                                )}

                            {/* Boards Grid */}
                            {section.boards.length > 0 && (
                                <div className="grid gap-4 md:grid-cols-4">
                                    {section.boards.map((board) => (
                                        <BoardCard
                                            key={board._id || board.id}
                                            board={board}
                                            onBoardUpdate={fetchBoards}
                                        />
                                    ))}

                                    {section.showCreate && (
                                        <BoardCard
                                            isCreate
                                            onCreate={() =>
                                                setOpenCreateBoard(true)
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {section.boards.length === 0 &&
                                section.showCreate && (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <BoardCard
                                            isCreate
                                            onCreate={() =>
                                                setOpenCreateBoard(true)
                                            }
                                        />
                                    </div>
                                )}
                        </section>
                    );
                })}

                <section>
                    <button
                        onClick={() => {
                            fetchClosedBoards();
                            setOpenClosedBoards(true);
                        }}
                        className="px-3 py-1 mt-2 mb-2 text-gray-100 rounded bg-slate-700 hover:bg-slate-600"
                    >
                        Xem các bảng đã đóng
                    </button>
                </section>
            </div>

            {openCreateBoard && (
                <CreateBoard
                    open={openCreateBoard}
                    onClose={() => setOpenCreateBoard(false)}
                    onCreate={handleBoardCreated}
                />
            )}
            {openClosedBoards && (
                <BoardClosed
                    open={openClosedBoards}
                    boards={closedBoards}
                    onReopen={handleReopenBoard}
                    onDelete={handleDeleteBoard}
                    onClose={() => setOpenClosedBoards(false)}
                />
            )}
        </>
    );
};

export default BoardPage;
