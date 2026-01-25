import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const DueDateTask = ({
    isOpen,
    onClose,
    currentStartDate,
    currentEndDate,
    onSave,
    onRemove,
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("00:00");
    // const [reminder, setReminder] = useState("none");
    const [saving, setSaving] = useState(false);
    const [isCustomStartDate, setIsCustomStartDate] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState("00:00");

    useEffect(() => {
        if (currentEndDate) {
            const endDate = new Date(currentEndDate);
            setSelectedDate(endDate);
            setSelectedTime(
                `${String(endDate.getHours()).padStart(2, "0")}:${String(
                    endDate.getMinutes(),
                ).padStart(2, "0")}`,
            );
        } else {
            // Reset về default khi không có endDate
            setSelectedDate(new Date());
            setSelectedTime("00:00");
        }

        if (currentStartDate) {
            const start = new Date(currentStartDate);
            setStartDate(start);
            setIsCustomStartDate(true);
            setStartTime(
                `${String(start.getHours()).padStart(2, "0")}:${String(
                    start.getMinutes(),
                ).padStart(2, "0")}`,
            );
        } else {
            // Reset về default khi không có startDate
            setIsCustomStartDate(false);
            setStartDate(new Date());
            setStartTime("00:00");
        }
    }, [currentEndDate, currentStartDate]);

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const renderCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Previous month days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: prevMonthDays - i,
                isCurrentMonth: false,
                isPrevMonth: true,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true,
                isPrevMonth: false,
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: i,
                isCurrentMonth: false,
                isPrevMonth: false,
            });
        }

        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setSelectedDate(newDate);
    };

    const handleSave = async () => {
        const [hours, minutes] = selectedTime.split(":");
        const endDate = new Date(selectedDate);
        endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        let calculatedStartDate = null;
        if (isCustomStartDate) {
            const [startHours, startMinutes] = startTime.split(":");
            calculatedStartDate = new Date(startDate);
            calculatedStartDate.setHours(
                parseInt(startHours),
                parseInt(startMinutes),
                0,
                0,
            );
        }

        setSaving(true);
        await onSave({
            startDate: calculatedStartDate
                ? calculatedStartDate.toISOString()
                : null,
            endDate: endDate.toISOString(),
        });
        setSaving(false);
    };

    const handleRemove = async () => {
        setSaving(true);
        await onRemove();
        setSaving(false);

        // Reset states sau khi remove
        setSelectedDate(new Date());
        setSelectedTime("00:00");
        setIsCustomStartDate(false);
        setStartDate(new Date());
        setStartTime("00:00");
        // setReminder("none");
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xs p-3 rounded-lg bg-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-100">
                        Ngày
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-0.5 text-gray-400 hover:text-gray-100"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Calendar */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => changeMonth(-12)}
                            className="p-1 text-2xl text-gray-400 hover:text-gray-100"
                        >
                            «
                        </button>
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-1 text-2xl text-gray-400 hover:text-gray-100"
                        >
                            ‹
                        </button>
                        <span className="text-lg font-semibold text-gray-100">
                            Tháng {selectedDate.getMonth() + 1}{" "}
                            {selectedDate.getFullYear()}
                        </span>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-1 text-2xl text-gray-400 hover:text-gray-100"
                        >
                            ›
                        </button>
                        <button
                            onClick={() => changeMonth(12)}
                            className="p-1 text-2xl text-gray-400 hover:text-gray-100"
                        >
                            »
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-0.5 text-center">
                        {["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="py-1 text-[12px] font-semibold text-gray-300"
                                >
                                    {day}
                                </div>
                            ),
                        )}
                        {renderCalendar().map((day, index) => {
                            const isSelected =
                                day.isCurrentMonth &&
                                day.date === selectedDate.getDate() &&
                                selectedDate.getMonth() ===
                                    new Date(selectedDate).getMonth();
                            const isToday =
                                day.isCurrentMonth &&
                                day.date === new Date().getDate() &&
                                selectedDate.getMonth() ===
                                    new Date().getMonth() &&
                                selectedDate.getFullYear() ===
                                    new Date().getFullYear();

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (day.isCurrentMonth) {
                                            const newDate = new Date(
                                                selectedDate,
                                            );
                                            newDate.setDate(day.date);
                                            setSelectedDate(newDate);
                                        }
                                    }}
                                    className={`
                                        py-1 rounded text-[12px]
                                        ${
                                            !day.isCurrentMonth
                                                ? "text-gray-600"
                                                : "text-gray-100"
                                        }
                                        ${
                                            isSelected
                                                ? "bg-blue-600 text-white"
                                                : ""
                                        }
                                        ${
                                            isToday && !isSelected
                                                ? "border border-blue-500"
                                                : ""
                                        }
                                        ${
                                            day.isCurrentMonth
                                                ? "hover:bg-slate-700"
                                                : ""
                                        }
                                    `}
                                >
                                    {day.date}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Start Date */}
                <div className="mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <input
                            type="checkbox"
                            id="customStartDate"
                            checked={isCustomStartDate}
                            onChange={(e) =>
                                setIsCustomStartDate(e.target.checked)
                            }
                            className="w-3 h-3 text-blue-600 rounded border-slate-900 bg-slate-900 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="customStartDate"
                            className="text-xs text-gray-400 cursor-pointer"
                        >
                            Ngày bắt đầu
                        </label>
                    </div>
                    {isCustomStartDate ? (
                        <div className="flex gap-1.5">
                            <input
                                type="date"
                                value={startDate.toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setStartDate(new Date(e.target.value))
                                }
                                className="flex-1 px-2 py-1 text-xs text-gray-100 border rounded bg-slate-900 border-slate-600"
                            />
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="px-2 py-1 text-xs text-gray-100 border rounded bg-slate-900 border-slate-600"
                            />
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={formatDate(new Date())}
                            disabled
                            className="w-full px-2 py-1 text-xs text-gray-500 border rounded bg-slate-900 border-slate-600"
                        />
                    )}
                </div>

                {/* Due Date */}
                <div className="mb-6">
                    <label className="block mb-1.5 text-xs text-gray-400">
                        Ngày hết hạn
                    </label>
                    <div className="flex gap-1.5">
                        <input
                            type="text"
                            value={formatDate(selectedDate)}
                            readOnly
                            className="flex-1 px-2 py-1 text-xs text-gray-100 border rounded bg-slate-900 border-slate-600"
                        />
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="flex px-2 py-1 text-xs text-gray-100 border rounded bg-slate-900 border-slate-600"
                        />
                    </div>
                </div>

                {/* Reminder
                <div className="mb-3">
                    <label className="block mb-1.5 text-xs text-gray-400">
                        Thiết lập Nhắc nhở
                    </label>
                    <select
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        className="w-full px-2 py-1 text-xs text-gray-100 border rounded bg-slate-900 border-slate-600"
                    >
                        <option value="none">Không có</option>
                        <option value="15min">Trước 15 phút</option>
                        <option value="1hour">Trước 1 giờ</option>
                        <option value="1day">Trước 1 ngày</option>
                        <option value="2days">Trước 2 ngày</option>
                        <option value="at-time">Vào thời điểm hết hạn</option>
                    </select>
                </div> */}

                {/* <p className="mb-2 text-[10px] text-gray-500">
                    Nhắc nhở sẽ được gửi đến tất cả các thành viên và người theo
                    dõi thẻ này.
                </p> */}

                {/* Actions */}
                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                        onClick={handleRemove}
                        disabled={saving}
                        className="w-full px-3 py-1.5 text-xs text-gray-300 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                    >
                        Gỡ bỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DueDateTask;
