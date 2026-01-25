import { X, UserPlus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import boardService from "../services/boardService";
import { avatar } from "../utils/avatar";
import MemberDetailPopup from "./MemberDetailPopup";

const MemberPopup = ({ open, onClose, board, onMemberChange }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const boardId = board?._id || board?.id;

    const popupRef = useRef(null);

    useEffect(() => {
        if (!open || !boardId) return;

        const fetchMembers = async () => {
            try {
                setLoadingMembers(true);
                const result = await boardService.getMembers(boardId);
                if (result.success) {
                    setMembers(result.data);
                } else {
                    alert(
                        result.message || "Không lấy được danh sách thành viên",
                    );
                }
            } catch (err) {
                console.error(err);
                alert("Có lỗi khi lấy danh sách thành viên");
            } finally {
                setLoadingMembers(false);
            }
        };

        fetchMembers();
    }, [open, boardId]);

    // click outside to close
    useEffect(() => {
        if (!open || selectedMember) return;

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, selectedMember, onClose]);

    const handleAddMember = async () => {
        if (!email.trim()) return;

        try {
            setLoading(true);
            const result = await boardService.addMember(boardId, email);

            if (result.success) {
                alert(result.message || "Thêm thành viên thành công");
                setEmail("");

                const membersRes = await boardService.getMembers(boardId);
                if (membersRes.success) {
                    setMembers(membersRes.data);
                }

                onMemberChange?.();
            } else {
                alert(result.message || "Thêm thành viên thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div
                    ref={popupRef}
                    className="fixed w-full max-w-md p-2 text-gray-100 -translate-x-1/2 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl top-16 left-1/2"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                        <h3 className="text-xl font-semibold">
                            Danh sách thành viên
                        </h3>
                        <button onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Add member */}
                    <div className="p-4 space-y-2 border-b border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Nhập email thành viên"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md outline-none"
                            />
                            <button
                                onClick={handleAddMember}
                                disabled={loading}
                                className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
                            >
                                <UserPlus size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>

                    {/* Member list */}
                    <div className="p-4 space-y-2 overflow-y-auto max-h-60">
                        {loadingMembers ? (
                            <p className="text-sm text-gray-400">Đang tải...</p>
                        ) : members.length > 0 ? (
                            members.map((member) => {
                                const user = member.user;

                                return (
                                    <div
                                        key={member.id}
                                        onClick={() =>
                                            setSelectedMember(member)
                                        }
                                        className="flex items-center justify-between px-2 py-1 rounded cursor-pointer hover:bg-gray-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`flex items-center justify-center text-xs font-semibold rounded-full w-7 h-7 ${user?.avatarColor}`}
                                            >
                                                {avatar(user?.name)}
                                            </div>

                                            <div>
                                                <p className="text-sm">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        {member.role === "owner" && (
                                            <span className="text-xs text-gray-400">
                                                Quản trị viên
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-400">
                                Chưa có thành viên
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <MemberDetailPopup
                open={!!selectedMember}
                member={selectedMember}
                boardId={boardId}
                onClose={() => setSelectedMember(null)}
                onRemoved={async () => {
                    const res = await boardService.getMembers(boardId);
                    if (res.success) setMembers(res.data);
                    onMemberChange?.();
                }}
            />
        </>
    );
};

export default MemberPopup;
