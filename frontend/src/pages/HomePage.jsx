import { FiClock, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateBoard from "../components/CreateBoard";
import boardService from "../services/boardService";

const HomePage = () => {
    const navigate = useNavigate();
    const [openCreateBoard, setOpenCreateBoard] = useState(false);
    const [recentBoards, setRecentBoards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentBoards();
    }, []);

    const fetchRecentBoards = async () => {
        setLoading(true);
        try {
            const result = await boardService.getRecentBoards();
            if (result.success) {
                setRecentBoards(result.data);
            }
        } catch (error) {
            console.error("Error fetching recent boards:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBoardClick = (boardId) => {
        navigate(`/task/${boardId}`);
    };

    const handleBoardCreated = (newBoard) => {
        console.log("Bảng mới:", newBoard);
        fetchRecentBoards();
    };

    return (
        <div className="flex gap-8">
            {/*  center content  */}
            <div className="flex-1">
                <div className="p-6 text-center text-gray-100 bg-slate-900">
                    <div className="mb-6">
                        <img
                            src="https://trello.com/assets/d1f066971350650d3346.svg"
                            alt="illustration"
                            className="w-64 mx-auto"
                        />
                    </div>

                    <h2 className="mb-3 text-xl font-semibold">
                        Theo dõi và cập nhật
                    </h2>

                    <p className="max-w-xl mx-auto text-gray-300">
                        Mời mọi người vào bảng và thẻ, để lại nhận xét, thêm
                        ngày hết hạn và chúng tôi sẽ hiển thị hoạt động quan
                        trọng nhất ở đây.
                    </p>
                </div>
            </div>

            {/*  right content */}
            <div className="w-80 shrink-0">
                <div className="p-4 bg-slate-900 rounded-xl">
                    {!loading && recentBoards.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-100">
                                <FiClock />
                                <span>Đã xem gần đây</span>
                            </div>

                            <ul className="space-y-2">
                                {recentBoards.map((board) => (
                                    <li
                                        key={board.id}
                                        onClick={() =>
                                            handleBoardClick(board.id)
                                        }
                                        className="flex items-center gap-3 p-1 transition rounded-lg cursor-pointer hover:bg-slate-800"
                                    >
                                        <div
                                            className={`w-12 h-8 rounded ${
                                                board.background ||
                                                "bg-blue-700"
                                            }`}
                                        />

                                        <div className="flex-1">
                                            <p className="text-sm text-gray-100">
                                                {board.name}
                                            </p>
                                           
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <div className={recentBoards.length > 0 ? "mt-6" : ""}>
                        <p className="mb-2 text-sm font-semibold text-gray-100">
                            Liên kết
                        </p>
                        <button
                            onClick={() => setOpenCreateBoard(true)}
                            className="flex items-center w-full gap-2 p-2 text-sm rounded-lg hover:bg-slate-800"
                        >
                            <div className="flex items-center justify-center w-10 h-8 text-gray-100 rounded bg-slate-700">
                                <FiPlus />
                            </div>
                            <span className="text-gray-100">Tạo bảng mới</span>
                        </button>
                    </div>
                </div>
            </div>
            <CreateBoard
                open={openCreateBoard}
                onClose={() => setOpenCreateBoard(false)}
                onCreate={handleBoardCreated}
            />
        </div>
    );
};

export default HomePage;
