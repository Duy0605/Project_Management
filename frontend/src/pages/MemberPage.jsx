import { useState, useEffect, useRef } from "react";
import { avatar } from "../utils/avatar";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import CommonBoard from "../components/CommonBoard";

const MemberRow = ({ member, currentUser, onViewCommonBoards, buttonRef }) => {
    const isCurrentUser = currentUser && member.id === currentUser.id;
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
            {/* Left */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                    className={`flex items-center justify-center w-10 h-10 text-sm font-semibold text-gray-100 rounded-full ${
                        member.avatarColor ||
                        "bg-gradient-to-br from-blue-500 to-blue-700"
                    }`}
                >
                    {avatar(member.name)}
                </div>

                {/* Info */}
                <div>
                    <p className="font-medium text-gray-100">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {!isCurrentUser && (
                    <button
                        ref={buttonRef}
                        onClick={() => onViewCommonBoards(member)}
                        className="px-3 py-1 text-sm text-gray-100 rounded bg-slate-700 hover:bg-slate-600"
                    >
                        Xem bảng chung
                    </button>
                )}
            </div>
        </div>
    );
};

const MemberPage = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const buttonRefs = useRef({});
    const [showCommonBoards, setShowCommonBoards] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const result = await userService.getSharedUsers();
            if (result.success) {
                setMembers(result.data);
            }
        } catch (error) {
            console.error("Fetch members error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCommonBoards = (member) => {
        if (selectedMember?.id === member.id && showCommonBoards) {
            setShowCommonBoards(false);
            setSelectedMember(null);
        } else {
            setSelectedMember(member);
            setShowCommonBoards(true);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-100">
                <p className="text-xl text-gray-400">Không có thành viên nào</p>
            </div>
        );
    }

    return (
        <div className="pt-8 space-y-4 text-gray-100 px-14">
            {/* Tổng số thành viên */}
            <p className="text-xl font-medium text-gray-100">
                Người cộng tác: {members.length}
            </p>
            <div className="mb-4 border-b border-slate-800"></div>

            {/* Danh sách thành viên */}
            <div>
                {members.map((member) => {
                    if (!buttonRefs.current[member.id]) {
                        buttonRefs.current[member.id] = { current: null };
                    }
                    return (
                        <MemberRow
                            key={member.id}
                            member={member}
                            currentUser={user}
                            onViewCommonBoards={handleViewCommonBoards}
                            buttonRef={buttonRefs.current[member.id]}
                        />
                    );
                })}
            </div>

            <CommonBoard
                open={showCommonBoards}
                onClose={() => {
                    setShowCommonBoards(false);
                    setSelectedMember(null);
                }}
                member={selectedMember}
                buttonRef={
                    selectedMember
                        ? buttonRefs.current[selectedMember.id]
                        : null
                }
            />
        </div>
    );
};

export default MemberPage;
