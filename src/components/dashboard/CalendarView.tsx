import { useMemo } from 'react';
import {
    startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    eachDayOfInterval, format, isSameMonth, isSameDay, isToday
} from 'date-fns';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}

export function CalendarView({ currentMonth, onMonthChange, selectedDate, onSelectDate }: CalendarProps) {
    const { tasks } = useStore();

    const daysInMonth = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const prevMonth = () => onMonthChange(startOfMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)));
    const nextMonth = () => onMonthChange(startOfMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)));

    const getDotsForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), date));
        const isWorkDay = tasks.some(t => t.work_date_start && dateStr >= t.work_date_start && dateStr <= (t.work_date_end || t.work_date_start));

        if (dayTasks.length === 0 && !isWorkDay) return null;

        const hasOverdue = dayTasks.some(t => t.status === 'OVERDUE');
        const hasWaiting = dayTasks.some(t => t.status === 'WAITING');
        const hasScheduled = dayTasks.some(t => t.status === 'SCHEDULED');
        const hasPaid = dayTasks.some(t => t.status === 'PAID');

        return (
            <div className="flex gap-0.5 mt-1 justify-center flex-wrap max-w-[80%] mx-auto">
                {isWorkDay && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Work Day" />}
                {hasOverdue && <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse-soft" />}
                {hasWaiting && !hasOverdue && <div className="w-1.5 h-1.5 rounded-full bg-warning" />}
                {hasPaid && !hasWaiting && !hasOverdue && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                {hasScheduled && !hasPaid && !hasWaiting && !hasOverdue && <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                {dayTasks.length > 1 && <div className="w-1 h-1 rounded-full bg-slate-400 mt-[1px]" />}
            </div>
        );
    };

    return (
        <div className="glass-card p-4">
            {/* Calendar Header with Navigation */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-900 haptic-active">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-900 haptic-active">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((date, i) => {
                    const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isDateToday = isToday(date);

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectDate(date)}
                            className={cn(
                                "h-12 flex flex-col items-center justify-start pt-1.5 rounded-xl transition-all haptic-active border border-transparent relative",
                                !isCurrentMonth && "opacity-30",
                                isSelected && "bg-primary/10 border-primary/30",
                                !isSelected && isDateToday && "bg-white border-primary/20 shadow-sm",
                                !isSelected && !isDateToday && "hover:bg-slate-50"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium",
                                isSelected ? "text-primary font-bold" : (isCurrentMonth ? "text-slate-700" : "text-slate-400")
                            )}>
                                {format(date, 'd')}
                            </span>
                            {getDotsForDate(date)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
