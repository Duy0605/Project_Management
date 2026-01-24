import { FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import columnService from "../services/columnService";
import boardService from "../services/boardService";
import taskService from "../services/taskService";
import SortableColumn from "../components/Sortable";
import BoardMenu from "../components/BoardMenu";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const getColumnId = (column) => (column._id || column.id).toString();

const TaskPage = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [columns, setColumns] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTask, setActiveTask] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const addColumnRef = useRef(null);

    const displayColumns = columns;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    const handleDragStart = (event) => {
        const { active } = event;

        const activeId = active.id.toString();

        const activeColumn = displayColumns.find(
            (col) => (col._id || col.id).toString() === activeId,
        );

        // kiểm tra là task hay column
        const isColumn = columns.some(
            (col) => (col._id || col.id).toString() === activeId,
        );
        if (isColumn) {
            setActiveType("column");
            return;
        }
        //Tìm task đang được kéo
        setActiveType("task");
        for (const col of columns) {
            const task = (col.tasks || []).find(
                (t) => (t._id || t.id).toString() === activeId,
            );
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    };

    const handleDragOver = (event) => {
        // Không làm gì khi drag over
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        // Reset states
        setActiveTask(null);
        const currentActiveType = activeType;
        setActiveType(null);

        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        if (activeId === overId) return;

        if (currentActiveType === "column") {
            const prevColumns = columns;
            const oldIndex = prevColumns.findIndex(
                (c) => (c._id || c.id).toString() === activeId,
            );
            const newIndex = prevColumns.findIndex(
                (c) => (c._id || c.id).toString() === overId,
            );

            const newColumns = arrayMove(prevColumns, oldIndex, newIndex);
            setColumns(newColumns);

            try {
                const result = await columnService.reorderColumns(
                    boardId,
                    activeId,
                    newIndex,
                );
                if (!result.success) setColumns(prevColumns);
            } catch {
                setColumns(prevColumns);
                alert("Sắp xếp lại cột thất bại");
            }
            return;
        }

        if (currentActiveType === "task") {
            // Tìm task đang kéo
            let activeTask = null;
            let activeColumnIndex = -1;

            for (let i = 0; i < columns.length; i++) {
                const task = (columns[i].tasks || []).find(
                    (t) => (t._id || t.id).toString() === activeId,
                );
                if (task) {
                    activeTask = task;
                    activeColumnIndex = i;
                    break;
                }
            }

            if (!activeTask || activeColumnIndex === -1) return;

            // Tìm column đích và vị trí
            let overColumnIndex = -1;
            let overTaskIndex = -1;

            // Check nếu drop vào task
            for (let i = 0; i < columns.length; i++) {
                const taskIndex = (columns[i].tasks || []).findIndex(
                    (t) => (t._id || t.id).toString() === overId,
                );
                if (taskIndex !== -1) {
                    overColumnIndex = i;
                    overTaskIndex = taskIndex;
                    break;
                }
            }

            // Check nếu drop vào column rỗng
            if (overColumnIndex === -1) {
                overColumnIndex = columns.findIndex(
                    (c) => (c._id || c.id).toString() === overId,
                );
                if (overColumnIndex !== -1) {
                    overTaskIndex = columns[overColumnIndex].tasks?.length || 0;
                }
            }

            if (overColumnIndex === -1) return;

            const activeColumnId = (
                columns[activeColumnIndex]._id || columns[activeColumnIndex].id
            ).toString();
            const overColumnId = (
                columns[overColumnIndex]._id || columns[overColumnIndex].id
            ).toString();

            if (activeColumnIndex === overColumnIndex) {
                const columnTasks = [
                    ...(columns[activeColumnIndex].tasks || []),
                ];
                const oldIndex = columnTasks.findIndex(
                    (t) => (t._id || t.id).toString() === activeId,
                );

                if (oldIndex === overTaskIndex) return;

                // di chuyển trong cùng cột
                const [movedTask] = columnTasks.splice(oldIndex, 1);
                columnTasks.splice(overTaskIndex, 0, movedTask);

                const newColumns = [...columns];
                newColumns[activeColumnIndex] = {
                    ...newColumns[activeColumnIndex],
                    tasks: columnTasks.map((t, idx) => ({ ...t, order: idx })),
                };
                setColumns(newColumns);

                // Gọi API reorder
                try {
                    const result = await taskService.reorderTask(
                        activeTask._id || activeTask.id,
                        overTaskIndex,
                    );
                    if (!result.success) {
                        alert(result.message || "Sắp xếp lại task thất bại");
                        // Rollback: fetch lại data
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Reorder task error:", error);
                    window.location.reload();
                }
            }
            // di chuyển giữa các cột
            else {
                const sourceColumnTasks = [
                    ...(columns[activeColumnIndex].tasks || []),
                ];
                const destColumnTasks = [
                    ...(columns[overColumnIndex].tasks || []),
                ];

                const sourceIndex = sourceColumnTasks.findIndex(
                    (t) => (t._id || t.id).toString() === activeId,
                );

                // di chuyển giữa các cột
                const [movedTask] = sourceColumnTasks.splice(sourceIndex, 1);
                movedTask.columnId = overColumnId;
                destColumnTasks.splice(overTaskIndex, 0, movedTask);

                const newColumns = [...columns];
                newColumns[activeColumnIndex] = {
                    ...newColumns[activeColumnIndex],
                    tasks: sourceColumnTasks.map((t, idx) => ({
                        ...t,
                        order: idx,
                    })),
                };
                newColumns[overColumnIndex] = {
                    ...newColumns[overColumnIndex],
                    tasks: destColumnTasks.map((t, idx) => ({
                        ...t,
                        order: idx,
                    })),
                };
                setColumns(newColumns);

                // Gọi API move
                try {
                    const result = await taskService.moveTask(
                        activeTask._id || activeTask.id,
                        overColumnId,
                        overTaskIndex,
                    );
                    if (!result.success) {
                        alert(result.message || "Di chuyển task thất bại");
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Move task error:", error);
                    window.location.reload();
                }
            }
        }
    };

    useEffect(() => {
        if (!boardId) return setLoading(false);
        (async () => {
            try {
                boardService.updateLastViewed(boardId);

                const boardRes = await boardService.getBoardById(boardId);
                const colRes = await columnService.getColumns(boardId);
                if (boardRes.success) setBoard(boardRes.data);
                if (colRes.success) {
                    const columnsData = colRes.data;

                    const columnsWithTasks = await Promise.all(
                        columnsData.map(async (col) => {
                            const taskRes = await taskService.getTasks(
                                col.id || col._id,
                            );
                            return {
                                ...col,
                                tasks: taskRes.success ? taskRes.data : [],
                            };
                        }),
                    );
                    setColumns(columnsWithTasks);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [boardId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                addColumnRef.current &&
                !addColumnRef.current.contains(event.target)
            ) {
                setShowAddColumn(false);
                setNewColumnTitle("");
                setError("");
            }
        };

        if (showAddColumn) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showAddColumn]);

    const handleCreateTask = async (columnId, title) => {
        try {
            const result = await taskService.createTask(columnId, { title });
            if (result.success) {
                // Cập nhật tasks trong column
                setColumns((prevColumns) =>
                    prevColumns.map((col) => {
                        const colId = col.id || col._id;
                        if (colId.toString() === columnId.toString()) {
                            return {
                                ...col,
                                tasks: [...(col.tasks || []), result.data],
                            };
                        }
                        return col;
                    }),
                );
                return true;
            } else {
                alert(result.message || "Tạo task thất bại");
                return false;
            }
        } catch (error) {
            alert("Lỗi khi tạo task");
            return false;
        }
    };

    const handleCreateColumn = async (e) => {
        e.preventDefault();
        if (!newColumnTitle.trim()) return setError("Vui lòng nhập tên column");

        setCreateLoading(true);
        try {
            const result = await columnService.createColumn(boardId, {
                title: newColumnTitle.trim(),
            });
            if (result.success) {
                setColumns([...columns, result.data]);
                setShowAddColumn(false);
                setNewColumnTitle("");
                setError("");
            } else setError(result.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteColumn = async (id, title) => {
        if (!window.confirm(`Bạn có chắc muốn xóa column "${title}"?`)) return;
        const result = await columnService.deleteColumn(boardId, id);
        if (result.success) {
            setColumns(columns.filter((c) => (c._id || c.id) !== id));
        }
    };

    const handleUpdateColumnTitle = async (id, title) => {
        const result = await columnService.updateColumn(boardId, id, { title });
        if (!result.success) return false;
        setColumns(
            columns.map((c) => ((c._id || c.id) === id ? { ...c, title } : c)),
        );
        return true;
    };

    const handleTaskUpdate = async (columnId) => {
        try {
            const taskRes = await taskService.getTasks(columnId);
            if (taskRes.success) {
                setColumns(
                    columns.map((col) =>
                        (col._id || col.id) === columnId
                            ? { ...col, tasks: taskRes.data }
                            : col,
                    ),
                );
            }
        } catch (error) {
            console.error("Error refetching tasks:", error);
        }
    };

    const [showBoardMenu, setShowBoardMenu] = useState(false);
    const boardMenuRef = useRef(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const sortableColumns = displayColumns;

    return (
        <div className="flex flex-col h-full ">
            <div className="flex items-center gap-6 p-2 pl-4 rounded-xl bg-slate-800 w-fit">
                <h1 className="text-2xl font-bold text-gray-100">
                    {board?.name || "Board"}
                </h1>
                <button
                    ref={boardMenuRef}
                    onClick={() => setShowBoardMenu(!showBoardMenu)}
                >
                    <FiChevronDown className="w-5 h-5 text-gray-100" />
                </button>
            </div>
            <BoardMenu
                open={showBoardMenu}
                onClose={() => setShowBoardMenu(false)}
                board={board}
                buttonRef={boardMenuRef}
                onBoardUpdate={async () => {
                    const boardRes = await boardService.getBoardById(boardId);
                    if (boardRes.success) {
                        setBoard(boardRes.data);
                    }
                }}
            />

            <div className="flex-1 pt-6 pb-4 overflow-x-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortableColumns.map(getColumnId)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex h-full gap-6 w-fit">
                            {displayColumns.map((col) => (
                                <SortableColumn
                                    key={getColumnId(col)}
                                    column={col}
                                    onDelete={handleDeleteColumn}
                                    onUpdateTitle={handleUpdateColumnTitle}
                                    onCreateTask={handleCreateTask}
                                    onTaskUpdate={handleTaskUpdate}
                                />
                            ))}

                            {showAddColumn ? (
                                <div
                                    ref={addColumnRef}
                                    className="p-3 bg-slate-900 w-72 rounded-xl"
                                >
                                    <form onSubmit={handleCreateColumn}>
                                        <input
                                            value={newColumnTitle}
                                            onChange={(e) =>
                                                setNewColumnTitle(
                                                    e.target.value,
                                                )
                                            }
                                            autoFocus
                                            placeholder="Nhập tên cột..."
                                            className="w-full px-3 py-2 mb-2 text-sm text-gray-100 border border-gray-600 rounded bg-slate-800"
                                        />
                                        {error && (
                                            <p className="mb-2 text-xs text-red-400">
                                                {error}
                                            </p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={createLoading}
                                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {createLoading
                                                    ? "Đang tạo..."
                                                    : "Thêm"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddColumn(false);
                                                    setNewColumnTitle("");
                                                    setError("");
                                                }}
                                                className="px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-slate-700"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAddColumn(true)}
                                    className="flex items-center h-10 gap-3 px-4 text-gray-100 rounded-lg bg-slate-800 w-72"
                                >
                                    <FiPlus /> Thêm cột
                                </button>
                            )}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeTask ? (
                            <div className="p-3 rounded-lg shadow-2xl bg-slate-700 w-72">
                                <p className="font-normal text-gray-100">
                                    {activeTask.title}
                                </p>
                            </div>
                        ) : null}
                        
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default TaskPage;
