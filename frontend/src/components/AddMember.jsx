import { useEffect, useRef, useState } from "react";
import { X, UserPlus } from "lucide-react";

const AddMember = ({ open, onClose, onAdd }) => {
    const modalRef = useRef(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (open) {
            setEmail("");
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!email.trim()) return;

        onAdd?.(email.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60">
            <div
                ref={modalRef}
                className="fixed w-full max-w-md p-5 text-gray-100 -translate-x-1/2 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl top-16 left-1/2"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Thêm thành viên</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 rounded hover:bg-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập địa chỉ email..."
                        className="flex-1 px-3 py-2 text-sm text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <UserPlus size={16} />
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMember;
