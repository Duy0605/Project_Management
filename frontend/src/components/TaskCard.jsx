import { avatar } from "../utils/avatar";
import { FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import taskService from "../services/taskService";

const TaskCard = ({ task, onClick, isPreview = false }) => {
    const [isChecked, setIsChecked] = useState(task.isCompleted || false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsChecked(task.isCompleted || false);
    }, [task.isCompleted]);

    const handleToggleCheck = async (e) => {
        e.stopPropagation();
        if (loading) return;

        const nextState = !isChecked;

        setIsChecked(nextState);
        setLoading(true);

        try {
            const res = await taskService.addChecklist(task.id, nextState);

            if (!res?.success) {
                setIsChecked(!nextState);
                alert(res?.message || "Lỗi khi cập nhật checklist");
            }
        } catch (error) {
            setIsChecked(!nextState);
            alert("Không thể kết nối server");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={() => onClick(task)}
            className="relative p-3 space-y-2 overflow-hidden transition-colors rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 group"
        >
            {/* Priority */}
            {task.priority === "medium" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            )}
            {task.priority === "high" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            )}

            {/* Checklist + title */}
            <div className="flex items-start">
                <button
                    onClick={handleToggleCheck}
                    disabled={loading}
                    className={`
                        flex shrink-0 items-center justify-center
                        h-5 rounded-full border-2
                        transition-all duration-200 ease-out
                        ${
                            isChecked
                                ? "w-5 opacity-100 bg-emerald-500 border-emerald-500 text-white"
                                : "w-0 opacity-0 border-gray-300 text-gray-300 group-hover:w-5 group-hover:opacity-100"
                        }
                        ${loading ? "cursor-not-allowed opacity-50" : ""}
                    `}
                >
                    {isChecked && <FiCheck size={14} />}
                </button>

                <p
                    className={`
                        font-normal transition-all duration-200 ease-out
                        ${
                            isChecked
                                ? "ml-2 text-gray-400 line-through"
                                : "ml-0 text-gray-100 group-hover:ml-2"
                        }
                    `}
                >
                    {task.title}
                </p>
            </div>

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
                <div className="flex justify-end mt-2">
                    <div className="flex -space-x-2">
                        {task.assignees.slice(0, 3).map((member) => (
                            <div
                                key={member._id}
                                className={`flex items-center justify-center w-6 h-6 text-[10px] font-semibold 
                                text-gray-100 rounded-full ${
                                    member.avatarColor ||
                                    "bg-gradient-to-br from-blue-500 to-blue-700"
                                }`}
                                title={member.name}
                            >
                                {member.avatar ? (
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full rounded-full"
                                    />
                                ) : (
                                    avatar(member.name)
                                )}
                            </div>
                        ))}

                        {task.assignees.length > 3 && (
                            <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-gray-600 border-2 rounded-full border-slate-700">
                                +{task.assignees.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
