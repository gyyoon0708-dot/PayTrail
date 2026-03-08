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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

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

        return (
            <div className="flex gap-0.5 mt-0.5 justify-center">
                {isWorkDay && <div className="w-1 h-1 rounded-full" style={{ background: '#38BDF8' }} />}
                {dayTasks.some(t => t.status === 'OVERDUE') && <div className="w-1 h-1 rounded-full" style={{ background: '#FF6B6B' }} />}
                {dayTasks.some(t => t.status === 'WAITING') && <div className="w-1 h-1 rounded-full" style={{ background: '#F5C542' }} />}
                {dayTasks.some(t => t.status === 'PAID') && <div className="w-1 h-1 rounded-full" style={{ background: '#10D9A0' }} />}
                {dayTasks.some(t => t.status === 'SCHEDULED') && !dayTasks.some(t => t.status !== 'SCHEDULED') && (
                    <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
                )}
            </div>
        );
    };

    return (
        <div className="glass-card p-4 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-text-primary">
                    {format(currentMonth, 'yyyy년 M월')}
                </h2>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center haptic-active transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ChevronLeft size={16} className="text-text-secondary" />
                    </button>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center haptic-active transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ChevronRight size={16} className="text-text-secondary" />
                    </button>
                </div>
            </div>

            {/* Weekdays header */}
            <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((day, i) => (
                    <div key={day} className={cn(
                        'text-center text-[11px] font-semibold py-1',
                        i === 0 ? 'text-danger' : i === 6 ? 'text-accent-sky' : 'text-text-muted'
                    )}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((date, i) => {
                    const isSelected = selectedDate ? isSameDay(selectedDate, date) : false;
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isDateToday = isToday(date);
                    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectDate(date)}
                            className={cn(
                                'flex flex-col items-center justify-start pt-1.5 rounded-xl h-11 haptic-active transition-all duration-150',
                                !isCurrentMonth && 'opacity-20',
                            )}
                            style={{
                                background: isSelected
                                    ? 'rgba(16,217,160,0.15)'
                                    : isDateToday
                                        ? 'rgba(16,217,160,0.08)'
                                        : 'transparent',
                                border: isSelected
                                    ? '1px solid rgba(16,217,160,0.4)'
                                    : isDateToday
                                        ? '1px solid rgba(16,217,160,0.2)'
                                        : '1px solid transparent',
                            }}
                        >
                            <span className={cn(
                                'text-xs font-semibold leading-none',
                                isSelected ? 'text-primary-400' :
                                    isDateToday ? 'text-primary-400' :
                                        dayOfWeek === 0 ? 'text-danger/70' :
                                            dayOfWeek === 6 ? 'text-accent-sky/70' :
                                                isCurrentMonth ? 'text-text-primary' : 'text-text-muted'
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
