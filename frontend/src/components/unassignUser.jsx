import { FiX } from "react-icons/fi";
import { avatar } from "../utils/avatar";

const UnassignUser = ({ member, isOpen, onClose, onRemove, saving }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full max-w-sm mx-4 overflow-hidden bg-slate-800 rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-100">
                        Thông tin thành viên
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 transition-colors rounded hover:bg-slate-700 hover:text-gray-100"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Member Info */}
                <div className="p-4">
                    <div className="flex items-center gap-4 p-4 mb-4 rounded-lg bg-slate-700">
                        <div
                            className={`flex items-center justify-center w-10 h-10 text-sm font-semibold text-gray-100 rounded-full ${
                                member.avatarColor ||
                                "bg-gradient-to-br from-blue-500 to-blue-700"
                            }`}
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
                        <div className="flex-1">
                            <p className="font-semibold text-gray-100">
                                {member.name}
                            </p>
                            <p className="text-sm text-gray-400">
                                {member.email}
                            </p>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(member._id)}
                        disabled={saving}
                        className="w-full px-4 py-3 text-sm font-medium text-gray-100 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Đang gỡ..." : "Gỡ thành viên khỏi thẻ"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnassignUser;
