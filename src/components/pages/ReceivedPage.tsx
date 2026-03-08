import React, { useState } from 'react';
import { X, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store';
import { useTranslation } from '../../lib/i18n';
import { formatCurrency } from '../../lib/utils';
import { format, addMonths, subMonths } from 'date-fns';
import confetti from 'canvas-confetti';
import { Task, TaskStatus } from '../../types';

interface Props {
    onClose: () => void;
    onEditTask: (taskId: string) => void;
}

export function ReceivedPage({ onClose, onEditTask }: Props) {
    const { tasks, userSettings, updateTask, subscription } = useStore();
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthYear = currentMonth.getFullYear();
    const monthIdx = currentMonth.getMonth();

    // Filter tasks for the current month (by due date)
    const monthTasks = tasks.filter(task => {
        const d = new Date(task.due_date);
        return d.getFullYear() === monthYear && d.getMonth() === monthIdx;
    });

    const paidTasks = monthTasks.filter(t => t.status === 'PAID');
    const unpaidTasks = monthTasks.filter(t => t.status !== 'PAID');

    const totalExpected = monthTasks.reduce((sum, task) => {
        if (task.status === 'PAID') {
            return sum + (task.received_amount || (task.amount - task.tax_deducted));
        }
        return sum + (task.amount - task.tax_deducted - task.received_amount);
    }, 0);

    const totalReceived = paidTasks.reduce((sum, task) => {
        return sum + (task.received_amount || (task.amount - task.tax_deducted));
    }, 0);

    const handleTogglePaid = (task: Task) => {
        if (task.status === 'PAID') {
            // Undo payment
            const dueDateObj = new Date(task.due_date);
            dueDateObj.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let newStatus: TaskStatus = 'SCHEDULED';
            if (dueDateObj < today) newStatus = 'OVERDUE';
            else if (dueDateObj.getTime() === today.getTime()) newStatus = 'WAITING';

            updateTask(task.id, { status: newStatus, received_amount: 0 });
        } else {
            // Mark as paid
            if (userSettings.audioEnabled) {
                const audio = new Audio('/kaching.mp3');
                audio.play().catch(() => { });
            }
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#15803D', '#10B981', '#FCD34D'] });
            updateTask(task.id, {
                status: 'PAID',
                received_amount: task.amount - task.tax_deducted,
                paid_date: new Date().toISOString(),
            });
        }
    };

    const prevMonth = () => setCurrentMonth(m => subMonths(m, 1));
    const nextMonth = () => setCurrentMonth(m => addMonths(m, 1));

    const renderTask = (task: Task) => {
        const isPaid = task.status === 'PAID';
        const net = task.amount - task.tax_deducted;

        return (
            <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isPaid
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-white border-slate-200'
                    }`}
            >
                {/* Checkbox */}
                <button
                    onClick={() => handleTogglePaid(task)}
                    className="flex-shrink-0 haptic-active"
                >
                    {isPaid ? (
                        <CheckCircle2 size={26} className="text-primary" />
                    ) : (
                        <Circle size={26} className="text-slate-300 hover:text-primary transition-colors" />
                    )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0" onClick={() => onEditTask(task.id)}>
                    <p className={`font-bold text-base truncate ${isPaid ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.company}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{t('dueDate')}: {task.due_date}</p>
                    {task.memo && <p className="text-xs text-slate-400 italic truncate mt-0.5">{task.memo}</p>}
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                    <p className={`font-black text-lg ${isPaid ? 'text-primary' : 'text-slate-900'}`}>
                        {formatCurrency(net, userSettings.currency)}
                    </p>
                    {isPaid && (
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {t('paid')}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-4 pt-10 pb-4 shadow-sm">
                <div className="flex items-center gap-3 max-w-md mx-auto">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <X size={22} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-900">{t('received')} 관리</h1>
                        <p className="text-xs text-slate-500">건별 수령 여부 확인 및 체크</p>
                    </div>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center justify-between max-w-md mx-auto mt-4">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <span className="text-base font-bold text-slate-800">
                        {format(currentMonth, 'yyyy년 M월')}
                    </span>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronRight size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Summary Bar */}
                <div className="max-w-md mx-auto mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-slate-500 mb-0.5">수령 완료</p>
                        <p className="font-bold text-primary text-sm">{formatCurrency(totalReceived, userSettings.currency)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-slate-500 mb-0.5">전체 ({monthTasks.length}건)</p>
                        <p className="font-bold text-slate-700 text-sm">{paidTasks.length} / {monthTasks.length} 완료</p>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-md mx-auto space-y-2">
                    {monthTasks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📋</span>
                            </div>
                            <p className="text-slate-500 font-medium">이달의 일정이 없습니다</p>
                        </div>
                    ) : (
                        <>
                            {/* Unpaid first */}
                            {unpaidTasks.length > 0 && (
                                <>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide px-1 pt-1">미수령 ({unpaidTasks.length}건)</p>
                                    {unpaidTasks.map(renderTask)}
                                </>
                            )}
                            {/* Paid tasks */}
                            {paidTasks.length > 0 && (
                                <>
                                    <p className="text-xs font-bold text-primary uppercase tracking-wide px-1 pt-3">수령 완료 ({paidTasks.length}건)</p>
                                    {paidTasks.map(renderTask)}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
