import { avatar } from "../utils/avatar";

const TaskCard = ({ task, onClick, isPreview = false }) => {
    return (
        <div
            onClick={() => onClick(task)}
            className="relative p-3 space-y-2 overflow-hidden rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600"
        >
            {task.priority === "medium" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            )}
            {task.priority === "high" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            )}
            <p className="font-normal text-gray-100">{task.title}</p>
            {task.assignees && task.assignees.length > 0 && (
                <div className="flex justify-end mt-2">
                    <div className="flex -space-x-2">
                        {task.assignees.slice(0, 3).map((member) => (
                            <div
                                key={member._id}
                                className={`flex items-center justify-center w-6 h-6 text-[10px] font-semibold text-gray-100 rounded-full ${
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
