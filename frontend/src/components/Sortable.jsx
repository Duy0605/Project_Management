import { useState, useEffect, useRef } from "react";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DetailTask from "./DetailTask";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import TaskCard from "./TaskCard";

const TaskColumn = ({
    column,
    onDelete,
    onUpdateTitle,
    dragHandleProps,
    onCreateTask,
    onTaskUpdate,
}) => {
    const columnId = (column._id || column.id).toString();

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(column.title);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [taskLoading, setTaskLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: {
            type: "column",
            column,
        },
    });

    const taskIds = (column.tasks || []).map((task) =>
        (task._id || task.id).toString(),
    );

    const taskFormRef = useRef(null);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseDetail = () => {
        setSelectedTask(null);
    };

    const handleSaveTitle = async () => {
        const title = editTitle.trim();

        if (!title) {
            alert("Tên cột không được để trống");
            setEditTitle(column.title);
            return;
        }

        if (title === column.title) {
            setIsEditing(false);
            return;
        }

        const success = await onUpdateTitle(columnId, title);
        success ? setIsEditing(false) : setEditTitle(column.title);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSaveTitle();
        if (e.key === "Escape") {
            setEditTitle(column.title);
            setIsEditing(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setTaskLoading(true);
        const success = await onCreateTask(columnId, newTaskTitle.trim());
        setTaskLoading(false);

        if (success) {
            setNewTaskTitle("");
            // Không đóng form, giữ focus để tiếp tục thêm task
        }
    };

    const closeTaskForm = () => {
        setShowAddTask(false);
        setNewTaskTitle("");
    };

    // Click ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                taskFormRef.current &&
                !taskFormRef.current.contains(event.target)
            ) {
                closeTaskForm();
            }
        };

        if (showAddTask) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showAddTask]);

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col p-3 shadow-sm bg-slate-800 w-72 h-fit max-h-[calc(100vh-200px)] shrink-0 rounded-xl transition-all ${
                isOver ? "ring-2 ring-blue-500" : ""
            }`}
        >
            <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                    <div className="flex items-center flex-1 gap-2">
                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSaveTitle}
                            autoFocus
                            className="flex-1 px-2 py-1 text-sm font-bold text-gray-100 border border-gray-600 rounded bg-slate-800 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleSaveTitle}
                            className="p-1 text-green-400 rounded hover:bg-slate-700"
                        >
                            <FiCheck className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <h3
                        {...dragHandleProps}
                        onDoubleClick={() => setIsEditing(true)}
                        className="flex-1 font-bold text-gray-100 hover:text-blue-400"
                    >
                        {column.title}
                    </h3>
                )}

                <div className="flex gap-1">
                    <button
                        onClick={() => onDelete(columnId, column.title)}
                        className="p-1 text-gray-400 rounded hover:bg-slate-700 hover:text-red-400"
                        title="Xoá cột"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
                <SortableContext
                    items={taskIds}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex-1 pb-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        {(column.tasks || []).map((task) => (
                            <SortableTask key={task._id || task.id} task={task}>
                                <TaskCard
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            </SortableTask>
                        ))}
                    </div>
                </SortableContext>

                {selectedTask && (
                    <DetailTask
                        taskId={selectedTask._id || selectedTask.id}
                        columnName={column.title}
                        onClose={handleCloseDetail}
                        onUpdate={() => {
                            if (onTaskUpdate) {
                                onTaskUpdate(column._id || column.id);
                            }
                        }}
                    />
                )}

                {showAddTask ? (
                    <div
                        ref={taskFormRef}
                        className="p-2 rounded-lg bg-slate-900"
                    >
                        <form onSubmit={handleCreateTask}>
                            <textarea
                                value={newTaskTitle}
                                onChange={(e) =>
                                    setNewTaskTitle(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCreateTask(e);
                                    }
                                }}
                                placeholder="Nhập tiêu đề cho thẻ này..."
                                autoFocus
                                rows={2}
                                className="w-full px-3 py-2 mb-2 text-sm text-gray-100 border border-gray-600 rounded-lg resize-none bg-slate-800 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={
                                        taskLoading || !newTaskTitle.trim()
                                    }
                                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {taskLoading ? "Đang thêm..." : "Thêm thẻ"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeTaskForm}
                                    className="px-2 py-1 text-gray-400 rounded hover:bg-slate-700"
                                >
                                    <FiX />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddTask(true)}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-100 rounded-lg hover:bg-slate-700"
                    >
                        <FiPlus />
                        Thêm thẻ
                    </button>
                )}
            </div>
        </div>
    );
};

// Sắp xếp cột
const SortableColumn = ({
    column,
    onDelete,
    onUpdateTitle,
    onCreateTask,
    onTaskUpdate,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: (column._id || column.id).toString(),
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <TaskColumn
                column={column}
                onDelete={onDelete}
                onUpdateTitle={onUpdateTitle}
                dragHandleProps={listeners}
                onCreateTask={onCreateTask}
                onTaskUpdate={onTaskUpdate}
            />
        </div>
    );
};

export default SortableColumn;
