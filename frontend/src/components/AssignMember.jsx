import { useState, useEffect } from "react";
import { FiX, FiUser, FiCheck } from "react-icons/fi";
import boardService from "../services/boardService";
import taskService from "../services/taskService";
import { avatar } from "../utils/avatar";

const AssignMember = ({
    isOpen,
    onClose,
    taskId,
    boardId,
    assignedMembers = [],
    onUpdate,
}) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        if (!isOpen || !boardId) return;

        const fetchMembers = async () => {
            setLoading(true);
            const result = await boardService.getMembers(boardId);
            if (result.success) {
                setMembers(result.data);
            }
            setLoading(false);
        };

        fetchMembers();
    }, [isOpen, boardId]);

    const handleAssignMember = async (userId) => {
        setAssigning(true);
        const result = await taskService.assignUser(taskId, userId);
        setAssigning(false);

        if (result.success) {
            if (onUpdate) onUpdate();
            onClose();
        } else {
            alert(result.message || "Gán thành viên thất bại");
        }
    };

    const isAssigned = (userId) => {
        return assignedMembers.some(
            (id) => id === userId || id === userId.toString(),
        );
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md mx-4 bg-slate-800 rounded-xl max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-100">
                        Gán thành viên
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 transition-colors rounded hover:bg-slate-700 hover:text-gray-100"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Members List */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    ) : members.length === 0 ? (
                        <p className="py-8 text-center text-gray-400">
                            Không có thành viên nào
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {members.map((member) => {
                                const assigned = isAssigned(member.user._id);
                                return (
                                    <button
                                        key={member.id}
                                        onClick={() =>
                                            !assigned &&
                                            handleAssignMember(member.user._id)
                                        }
                                        disabled={assigning || assigned}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                            assigned
                                                ? "bg-slate-900 cursor-not-allowed opacity-60"
                                                : "bg-slate-700 hover:bg-slate-600"
                                        }`}
                                    >
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full ${
                                                member.user.avatarColor ||
                                                "bg-gradient-to-br from-blue-500 to-blue-700"
                                            }`}
                                        >
                                            {member.user.avatar ? (
                                                <img
                                                    src={member.user.avatar}
                                                    alt={member.user.name}
                                                    className="w-full h-full rounded-full"
                                                />
                                            ) : (
                                                avatar(member.user.name)
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-gray-100">
                                                {member.user.name}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {member.user.email}
                                            </p>
                                        </div>
                                        {assigned && (
                                            <FiCheck className="w-5 h-5 text-green-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignMember;
