import { useState, useEffect } from "react";
import CreateBoard from "../components/CreateBoard";
import BoardCard from "../components/BoardCard";
import BoardClosed from "../components/BoardClosed";
import boardService from "../services/boardService";

const PersonalBoardPage = () => {
    const [openCreateBoard, setOpenCreateBoard] = useState(false);
    const [myBoards, setMyBoards] = useState([]);
    const [closedBoards, setClosedBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClosedBoards, setShowClosedBoards] = useState(false);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const result = await boardService.getAllBoards();
            if (result.success) {
                setMyBoards(result.data);
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
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold uppercase">
                            Các Dự án của tôi
                        </h2>
                    </div>
                    <div className="mb-4 border-b border-slate-800"></div>

                    {myBoards.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-4">
                            {myBoards.map((board) => (
                                <BoardCard
                                    key={board._id || board.id}
                                    board={board}
                                    onBoardUpdate={fetchBoards}
                                />
                            ))}

                            <BoardCard
                                isCreate
                                onCreate={() => setOpenCreateBoard(true)}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <BoardCard
                                isCreate
                                onCreate={() => setOpenCreateBoard(true)}
                            />
                        </div>
                    )}
                </section>

                <section>
                    <button
                        onClick={() => {
                            fetchClosedBoards();
                            setShowClosedBoards(true);
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
            {showClosedBoards && (
                <BoardClosed
                    open={showClosedBoards}
                    boards={closedBoards}
                    onReopen={handleReopenBoard}
                    onDelete={handleDeleteBoard}
                    onClose={() => setShowClosedBoards(false)}
                />
            )}
        </>
    );
};

export default PersonalBoardPage;
