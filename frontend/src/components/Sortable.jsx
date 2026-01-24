import { useState, useEffect, useRef } from "react";
import { FiPlus, FiX, FiCheck, FiGripVertical } from "react-icons/fi";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";

import SortableTask from "./SortableTask";
import TaskCard from "./TaskCard";
import DetailTask from "./DetailTask";


const TaskColumn = ({
    column,
    dragHandleProps,
    onDelete,
    onUpdateTitle,
    onCreateTask,
    onTaskUpdate,
}) => {
    const columnId = (column._id || column.id).toString();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const taskFormRef = useRef(null);

    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: { type: "column" },
    });

    const taskIds = (column.tasks || []).map((t) => (t._id || t.id).toString());

    // lưu tiêu đề sau khi chỉnh sửa
    const saveTitle = async () => {
        const newTitle = title.trim();
        if (!newTitle || newTitle === column.title) {
            setTitle(column.title);
            setIsEditing(false);
            return;
        }

        const success = await onUpdateTitle(columnId, newTitle);
        if (!success) setTitle(column.title);
        setIsEditing(false);
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setLoading(true);
        const success = await onCreateTask(columnId, newTaskTitle.trim());
        setLoading(false);

        if (success) {
            setNewTaskTitle("");
        }
    };

    // click ngoài
    useEffect(() => {
        const handler = (e) => {
            if (
                taskFormRef.current &&
                !taskFormRef.current.contains(e.target)
            ) {
                setShowAddTask(false);
                setNewTaskTitle("");
            }
        };

        if (showAddTask) {
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }
    }, [showAddTask]);

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col p-3 w-72 shrink-0 rounded-xl bg-slate-800 transition ${
                isOver ? "ring-2 ring-blue-500" : ""
            }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                {/* Drag handle */}
                <button
                    {...dragHandleProps}
                    className="p-1 text-gray-400 cursor-grab hover:text-white"
                >
                    <FiGripVertical />
                </button>

                {isEditing ? (
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitle();
                            if (e.key === "Escape") {
                                setTitle(column.title);
                                setIsEditing(false);
                            }
                        }}
                        className="flex-1 px-2 py-1 text-sm font-bold text-white rounded bg-slate-700"
                    />
                ) : (
                    <h3
                        onDoubleClick={() => setIsEditing(true)}
                        className="flex-1 font-bold text-gray-100 select-none"
                    >
                        {column.title}
                    </h3>
                )}

                <button
                    onClick={() => onDelete(columnId, column.title)}
                    className="p-1 text-gray-400 hover:text-red-400"
                >
                    <FiX />
                </button>
            </div>

            {/* Tasks */}
            <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
                    {(column.tasks || []).map((task) => (
                        <SortableTask key={task._id || task.id} task={task}>
                            <TaskCard
                                task={task}
                                onClick={() => setSelectedTask(task)}
                            />
                        </SortableTask>
                    ))}
                </div>
            </SortableContext>

            {/* Chi tiết task */}
            {selectedTask && (
                <DetailTask
                    taskId={selectedTask._id || selectedTask.id}
                    columnName={column.title}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => onTaskUpdate(column._id || column.id)}
                />
            )}

            {/* Thêm task */}
            {showAddTask ? (
                <div
                    ref={taskFormRef}
                    className="p-2 mt-3 rounded-lg bg-slate-900"
                >
                    <form onSubmit={createTask}>
                        <textarea
                            autoFocus
                            rows={2}
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full px-2 py-1 text-sm text-white rounded bg-slate-800"
                            placeholder="Nhập tiêu đề thẻ..."
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                            >
                                {loading ? "Đang thêm..." : "Thêm"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddTask(false)}
                                className="px-2 py-1 text-gray-400"
                            >
                                <FiX />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddTask(true)}
                    className="flex items-center gap-2 mt-3 text-sm text-gray-300 hover:text-white"
                >
                    <FiPlus /> Thêm thẻ
                </button>
            )}
        </div>
    );
};

const SortableColumn = (props) => {
    const { column } = props;

    const { setNodeRef, transform, transition, attributes, listeners } =
        useSortable({
            id: (column._id || column.id).toString(),
            data: { type: "column" },
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <TaskColumn {...props} dragHandleProps={listeners} />
        </div>
    );
};

export default SortableColumn;
