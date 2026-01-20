import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTask = ({ task, children }) => {
    const taskId = (task._id || task.id).toString();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: taskId,
        data: {
            type: "task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 999 : "auto",
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                {children}
            </div>
        </div>
    );
};

export default SortableTask;
