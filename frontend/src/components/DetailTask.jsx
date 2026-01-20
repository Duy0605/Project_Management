import { useState, useEffect, useRef } from "react";
import {
    FiX,
    FiCalendar,
    FiFlag,
    FiUsers,
    FiAlignLeft,
    FiPlus,
    FiTrash2,
} from "react-icons/fi";
import taskService from "../services/taskService";
import DueDateTask from "./DueDateTask";
import AssignMember from "./AssignMember";
import UnassignUser from "./unassignUser";
import { avatar } from "../utils/avatar";

const DetailTask = ({ taskId, columnName, onClose, onUpdate }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("low");
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAssignMember, setShowAssignMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const priorityMenuRef = useRef(null);

    useEffect(() => {
        if (!taskId) return;

        const fetchTaskDetail = async () => {
            setLoading(true);
            const result = await taskService.getTaskById(taskId);
            if (result.success) {
                setTask(result.data);
                setTitle(result.data.title || "");
                setDescription(result.data.description || "");
                setPriority(result.data.priority || "low");
            }
            setLoading(false);
        };

        fetchTaskDetail();
    }, [taskId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                priorityMenuRef.current &&
                !priorityMenuRef.current.contains(event.target)
            ) {
                setShowPriorityMenu(false);
            }
        };

        if (showPriorityMenu) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showPriorityMenu]);

    const handleUpdateTask = async (updates) => {
        setSaving(true);
        const result = await taskService.updateTask(taskId, updates);
        setSaving(false);

        if (result.success) {
            setTask({ ...task, ...updates });
            if (onUpdate) onUpdate();
            return true;
        } else {
            alert(result.message || "Cập nhật thất bại");
            return false;
        }
    };

    const handleSaveTitle = async () => {
        if (!title.trim()) {
            alert("Tiêu đề không được để trống");
            setTitle(task?.title || "");
            return;
        }

        if (title === task?.title) {
            setIsEditingTitle(false);
            return;
        }

        const success = await handleUpdateTask({ title: title.trim() });
        if (success) setIsEditingTitle(false);
    };

    const handleSaveDescription = async () => {
        if (description === task?.description) {
            setIsEditingDescription(false);
            return;
        }

        const success = await handleUpdateTask({ description });
        if (success) setIsEditingDescription(false);
    };

    const handleChangePriority = async (newPriority) => {
        await handleUpdateTask({ priority: newPriority });
        setPriority(newPriority);
        setShowPriorityMenu(false);
    };

    const handleSaveDueDate = async (dates) => {
        const success = await handleUpdateTask({
            startDate: dates.startDate,
            endDate: dates.endDate,
        });
        if (success) {
            setShowDatePicker(false);
        }
    };

    const handleRemoveDueDate = async () => {
        const success = await handleUpdateTask({
            startDate: null,
            endDate: null,
        });
        if (success) {
            setTask({ ...task, startDate: null, endDate: null });
            setShowDatePicker(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        setSaving(true);
        const result = await taskService.unassignUser(taskId, userId);
        setSaving(false);

        if (result.success) {
            // Cập nhật lại task data
            const updatedTask = await taskService.getTaskById(taskId);
            if (updatedTask.success) {
                setTask(updatedTask.data);
            }
            if (onUpdate) onUpdate();
            setSelectedMember(null);
        } else {
            alert(result.message || "Gỡ thành viên thất bại");
        }
    };

    const handleDeleteTask = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa task này?")) return;

        setSaving(true);
        const result = await taskService.deleteTask(taskId);
        setSaving(false);

        if (result.success) {
            if (onUpdate) onUpdate();
            onClose();
        } else {
            alert(result.message || "Xóa task thất bại");
        }
    };

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    if (!taskId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl mx-4 bg-slate-800 rounded-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-slate-800 border-slate-700">
                    <div className="flex-1 mr-4">
                        <p className="text-sm text-gray-400">{columnName}</p>
                        {loading ? (
                            <h2 className="mt-1 text-xl font-bold text-gray-100">
                                Đang tải...
                            </h2>
                        ) : isEditingTitle ? (
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveTitle();
                                    if (e.key === "Escape") {
                                        setTitle(task?.title || "");
                                        setIsEditingTitle(false);
                                    }
                                }}
                                autoFocus
                                className="w-full px-2 py-1 mt-1 text-xl font-bold text-gray-100 border border-gray-600 rounded bg-slate-900 focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <h2
                                onClick={() => setIsEditingTitle(true)}
                                className="mt-1 text-xl font-bold text-gray-100 cursor-pointer hover:text-blue-400"
                            >
                                {task?.title}
                            </h2>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-slate-700 hover:text-gray-100"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <div className="p-6">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                onClick={() => setShowDatePicker(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 transition-colors border rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600"
                            >
                                <FiCalendar className="w-4 h-4" />
                                Ngày{" "}
                                {task?.endDate &&
                                    `(${formatDate(task.endDate)})`}
                            </button>

                            <div className="relative" ref={priorityMenuRef}>
                                <button
                                    onClick={() =>
                                        setShowPriorityMenu(!showPriorityMenu)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 transition-colors border rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600"
                                >
                                    <div className="relative">
                                        <FiFlag className="w-4 h-4" />
                                        {priority === "medium" && (
                                            <div className="absolute -left-1 top-0 w-0.5 h-full bg-orange-500 rounded"></div>
                                        )}
                                        {priority === "high" && (
                                            <div className="absolute -left-1 top-0 w-0.5 h-full bg-red-500 rounded"></div>
                                        )}
                                    </div>
                                    Độ ưu tiên:{" "}
                                    {priority === "low"
                                        ? "Thấp"
                                        : priority === "medium"
                                          ? "Trung bình"
                                          : "Cao"}
                                </button>

                                {showPriorityMenu && (
                                    <div className="absolute z-20 w-40 mt-2 text-gray-100 border rounded-lg shadow-lg bg-slate-700 border-slate-600">
                                        <button
                                            onClick={() =>
                                                handleChangePriority("low")
                                            }
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-600 rounded-t-lg flex items-center gap-2 ${
                                                priority === "low"
                                                    ? "bg-slate-600"
                                                    : ""
                                            }`}
                                        >
                                            <div className="relative w-4 h-4">
                                                <FiFlag className="w-4 h-4" />
                                            </div>
                                            Thấp
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleChangePriority("medium")
                                            }
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-600 flex items-center gap-2 ${
                                                priority === "medium"
                                                    ? "bg-slate-600"
                                                    : ""
                                            }`}
                                        >
                                            <div className="relative w-4 h-4">
                                                <FiFlag className="w-4 h-4" />
                                                <div className="absolute -left-1 top-0 w-0.5 h-full bg-orange-500 rounded"></div>
                                            </div>
                                            Trung bình
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleChangePriority("high")
                                            }
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-600 rounded-b-lg flex items-center gap-2 ${
                                                priority === "high"
                                                    ? "bg-slate-600"
                                                    : ""
                                            }`}
                                        >
                                            <div className="relative w-4 h-4">
                                                <FiFlag className="w-4 h-4" />
                                                <div className="absolute -left-1 top-0 w-0.5 h-full bg-red-500 rounded"></div>
                                            </div>
                                            Cao
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowAssignMember(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 transition-colors border rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600"
                            >
                                <FiUsers className="w-4 h-4" />
                                Thành viên
                                {task?.assignees?.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-600 rounded-full">
                                        {task.assignees.length}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={handleDeleteTask}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-100 transition-colors border rounded-lg border-slate-600 bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                            >
                                <FiTrash2 className="w-4 h-4" />
                                Xóa thẻ
                            </button>
                        </div>

                        {/* Description Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <FiAlignLeft className="w-5 h-5 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-100">
                                    Mô tả
                                </h3>
                            </div>

                            {isEditingDescription ? (
                                <div>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Thêm mô tả chi tiết hơn..."
                                        className="w-full px-4 py-3 text-sm text-gray-100 border rounded-lg resize-none bg-slate-900 border-slate-600 focus:outline-none focus:border-blue-500 min-h-32"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={handleSaveDescription}
                                            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingDescription(false);
                                                setDescription(
                                                    task?.description || "",
                                                );
                                            }}
                                            className="px-4 py-2 text-sm text-gray-300 transition-colors rounded-lg hover:bg-slate-700"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        setIsEditingDescription(true)
                                    }
                                    className="px-4 py-3 text-sm text-gray-100 transition-colors border rounded-lg cursor-pointer bg-slate-900 border-slate-600 hover:bg-slate-700 min-h-24"
                                >
                                    {task?.description || (
                                        <span className="text-gray-500">
                                            Thêm mô tả chi tiết hơn...
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Members Section */}
                        {task?.assignees && task.assignees.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiUsers className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-100">
                                        Thành viên
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    {task.assignees.map((member) => (
                                        <div
                                            key={member._id}
                                            className="relative"
                                        >
                                            <div
                                                onClick={() =>
                                                    setSelectedMember(member)
                                                }
                                                className={`flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 ${member.avatarColor || "bg-gradient-to-br from-blue-500 to-blue-700"}`}
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

                                            <UnassignUser
                                                member={member}
                                                isOpen={
                                                    selectedMember?._id ===
                                                    member._id
                                                }
                                                onClose={() =>
                                                    setSelectedMember(null)
                                                }
                                                onRemove={handleRemoveMember}
                                                saving={saving}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() =>
                                            setShowAssignMember(true)
                                        }
                                        className="flex items-center justify-center w-10 h-10 text-gray-400 transition-colors border-2 border-gray-600 border-dashed rounded-full hover:border-gray-500 hover:text-gray-300"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Date Picker Component */}
                        <DueDateTask
                            isOpen={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                            currentStartDate={task?.startDate}
                            currentEndDate={task?.endDate}
                            onSave={handleSaveDueDate}
                            onRemove={handleRemoveDueDate}
                        />

                        {/* Assign Member Component */}
                        <AssignMember
                            isOpen={showAssignMember}
                            onClose={() => setShowAssignMember(false)}
                            taskId={taskId}
                            boardId={task?.boardId}
                            assignedMembers={task?.assignees || []}
                            onUpdate={async () => {
                                const result =
                                    await taskService.getTaskById(taskId);
                                if (result.success) {
                                    setTask(result.data);
                                }
                                if (onUpdate) onUpdate();
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailTask;
