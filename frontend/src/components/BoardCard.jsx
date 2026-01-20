import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import BoardMenu from "./BoardMenu";

const BoardCard = ({ board, isCreate, onCreate, onBoardUpdate }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuButtonRef = useRef(null);

    if (isCreate) {
        return (
            <div
                onClick={onCreate}
                className="flex items-center justify-center h-[128px] transition bg-slate-800 cursor-pointer rounded-xl hover:bg-slate-700"
            >
                <div className="text-center text-gray-100">
                    <p className="font-medium">Tạo bảng mới</p>
                </div>
            </div>
        );
    }

    const boardId = board._id || board.id;
    const background = board.background || "bg-blue-700";

    const handleClick = () => {
        if (boardId) {
            navigate(`/task/${boardId}`);
        }
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <>
            <div
                onClick={handleClick}
                className="overflow-hidden transition cursor-pointer bg-slate-800 rounded-xl hover:brightness-125"
            >
                <div className={`h-20 ${background}`} />
                <div className="flex items-center justify-between p-3">
                    <p className="text-sm text-gray-100 truncate">
                        {board.name}
                    </p>
                    <button
                        ref={menuButtonRef}
                        onClick={handleMenuClick}
                        className="px-2 font-bold text-gray-400 hover:text-gray-100"
                    >
                        ⋮
                    </button>
                </div>
            </div>

            <BoardMenu
                open={showMenu}
                onClose={() => setShowMenu(false)}
                board={board}
                buttonRef={menuButtonRef}
                onBoardUpdate={onBoardUpdate}
            />
        </>
    );
};

export default BoardCard;
