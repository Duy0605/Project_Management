import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { avatar } from "../utils/avatar";
import activityService from "../services/activityService";

const RecentActivities = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async (isLoadMore = false) => {
        setLoading(true);
        const currentSkip = isLoadMore ? skip : 0;

        const result = await activityService.getActivities(limit, currentSkip);

        if (result.success) {
            if (isLoadMore) {
                setActivities([...activities, ...result.data]);
            } else {
                setActivities(result.data);
            }
            setHasMore(result.hasMore);
            setSkip(currentSkip + limit);
        }

        setLoading(false);
    };

    const handleLoadMore = () => {
        fetchActivities(true);
    };

    const renderActivityText = (activity) => {
        const { action, taskName, boardName, targetUser } = activity;

        switch (action) {
            case "created_board":
                return (
                    <>
                        đã tạo bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "closed_board":
                return (
                    <>
                        đã đóng bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "reopened_board":
                return (
                    <>
                        đã mở lại bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "deleted_board":
                return (
                    <>
                        đã xóa bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "updated_board":
                return (
                    <>
                        đã cập nhật bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "created_column":
                return (
                    <>
                        đã tạo cột{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {activity.columnName}
                        </span>
                        {boardName && (
                            <>
                                {" "}
                                trên bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "updated_column":
                return (
                    <>
                        đã cập nhật cột{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {activity.columnName}
                        </span>
                        {boardName && (
                            <>
                                {" "}
                                trên bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "deleted_column":
                return (
                    <>
                        đã xóa cột trên bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "created_task":
                return (
                    <>
                        đã tạo thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>
                        {activity.columnName && (
                            <>
                                {" "}
                                trên cột{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {activity.columnName}
                                </span>
                            </>
                        )}
                        {boardName && (
                            <>
                                {" "}
                                của bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "updated_task":
                return (
                    <>
                        đã cập nhật thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>
                        {activity.columnName && (
                            <>
                                {" "}
                                trên cột{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {activity.columnName}
                                </span>
                            </>
                        )}
                        {boardName && (
                            <>
                                {" "}
                                của bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "deleted_task":
                return (
                    <>
                        đã xóa thẻ
                        {activity.columnName && (
                            <>
                                {" "}
                                trên cột{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {activity.columnName}
                                </span>
                            </>
                        )}
                        {boardName && (
                            <>
                                {" "}
                                của bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "completed_task":
                return (
                    <>
                        đã đánh dấu thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>{" "}
                        là hoàn tất trên bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "uncompleted_task":
                return (
                    <>
                        đã đánh dấu thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>{" "}
                        là chưa hoàn tất trên bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "assigned_task":
                return (
                    <>
                        đã tham gia thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>
                        {activity.columnName && (
                            <>
                                {" "}
                                trên cột{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {activity.columnName}
                                </span>
                            </>
                        )}
                        {boardName && (
                            <>
                                {" "}
                                của bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "unassigned_task":
                return (
                    <>
                        đã rời khỏi thẻ{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {taskName}
                        </span>
                        {activity.columnName && (
                            <>
                                {" "}
                                trên cột{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {activity.columnName}
                                </span>
                            </>
                        )}
                        {boardName && (
                            <>
                                {" "}
                                của bảng{" "}
                                <span className="text-blue-400 cursor-pointer hover:underline">
                                    {boardName}
                                </span>
                            </>
                        )}
                    </>
                );
            case "added_member":
                return (
                    <>
                        đã thêm{" "}
                        <span className="font-semibold">
                            {targetUser?.name}
                        </span>{" "}
                        vào bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            case "removed_member":
                return (
                    <>
                        đã xóa{" "}
                        <span className="font-semibold">
                            {targetUser?.name}
                        </span>{" "}
                        khỏi bảng{" "}
                        <span className="text-blue-400 cursor-pointer hover:underline">
                            {boardName}
                        </span>
                    </>
                );
            default:
                return action;
        }
    };

    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return date.toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return "Vừa xong";
    };

    return (
        <div className="min-h-screen py-8 text-gray-100 pl-60 bg-slate-900">
            <div className="max-w-4xl">
                <h1 className="flex items-center gap-2 mb-6 text-2xl font-semibold">
                    <span className="text-xl">☰</span>
                    Hoạt động gần đây
                </h1>

                {loading && activities.length === 0 ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        <p>Chưa có hoạt động nào</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3">
                                    {/* Avatar */}
                                    <div
                                        className={`flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full ${
                                            activity.user.avatarColor ||
                                            "bg-gradient-to-br from-blue-500 to-blue-700"
                                        }`}
                                    >
                                        {avatar(activity.user.name)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300">
                                            <span className="font-semibold">
                                                {activity.user.name}
                                            </span>{" "}
                                            {renderActivityText(activity)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatTime(activity.time)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load more button */}
                        {hasMore && (
                            <div className="mt-6">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm text-gray-300 transition rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Đang tải..."
                                        : "Tải thêm hoạt động"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
