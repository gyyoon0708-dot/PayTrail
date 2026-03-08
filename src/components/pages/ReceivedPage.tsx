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
    const { tasks, userSettings, updateTask } = useStore();
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const yr = currentMonth.getFullYear();
    const mo = currentMonth.getMonth();

    const monthTasks = tasks.filter(task => {
        const d = new Date(task.due_date);
        return d.getFullYear() === yr && d.getMonth() === mo;
    }).sort((a, b) => a.due_date.localeCompare(b.due_date));

    const paidTasks = monthTasks.filter(t => t.status === 'PAID');
    const unpaidTasks = monthTasks.filter(t => t.status !== 'PAID');

    const totalReceived = paidTasks.reduce((s, t) => s + (t.received_amount || (t.amount - t.tax_deducted)), 0);
    const totalExpected = unpaidTasks.reduce((s, t) => s + (t.amount - t.tax_deducted - t.received_amount), 0);
    const rate = monthTasks.length > 0 ? Math.round((paidTasks.length / monthTasks.length) * 100) : 0;

    const handleTogglePaid = (task: Task) => {
        if (task.status === 'PAID') {
            const due = new Date(task.due_date); due.setHours(0, 0, 0, 0);
            const today = new Date(); today.setHours(0, 0, 0, 0);
            let s: TaskStatus = 'SCHEDULED';
            if (due < today) s = 'OVERDUE';
            else if (due.getTime() === today.getTime()) s = 'WAITING';
            updateTask(task.id, { status: s, received_amount: 0 });
        } else {
            if (userSettings.audioEnabled) { new Audio('/kaching.mp3').play().catch(() => { }); }
            confetti({ particleCount: 60, spread: 55, origin: { y: 0.5 }, colors: ['#10D9A0', '#F5C542'] });
            updateTask(task.id, { status: 'PAID', received_amount: task.amount - task.tax_deducted, paid_date: new Date().toISOString() });
        }
    };

    const renderTask = (task: Task) => {
        const isPaid = task.status === 'PAID';
        const net = task.amount - task.tax_deducted;

        return (
            <div key={task.id} className={`flex items-center gap-3 p-4 rounded-[16px] mb-2 transition-all duration-200 animate-fade-in`}
                style={{
                    background: isPaid ? 'rgba(16,217,160,0.06)' : 'linear-gradient(145deg, rgba(26,34,53,0.9) 0%, rgba(15,22,42,0.95) 100%)',
                    border: `1px solid ${isPaid ? 'rgba(16,217,160,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <button onClick={() => handleTogglePaid(task)} className="shrink-0 haptic-active">
                    {isPaid
                        ? <CheckCircle2 size={26} style={{ color: '#10D9A0' }} />
                        : <Circle size={26} className="text-text-disabled hover:text-primary transition-colors" />}
                </button>

                <div className="flex-1 min-w-0" onClick={() => onEditTask(task.id)}>
                    <p className={`font-bold text-sm truncate ${isPaid ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                        {task.company}
                    </p>
                    {task.work_date_start && (
                        <p className="text-xs text-text-muted mt-0.5">
                            {task.work_date_start}{task.work_date_end && task.work_date_end !== task.work_date_start ? ` ~ ${task.work_date_end}` : ''}
                        </p>
                    )}
                </div>

                <div className="text-right shrink-0">
                    <p className={`font-black text-base amount-display ${isPaid ? 'text-primary-400' : 'text-text-primary'}`}>
                        {formatCurrency(net, userSettings.currency)}
                    </p>
                    {isPaid && <span className="badge badge-paid text-[10px] mt-0.5">{t('paid')}</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1525 100%)' }}>
            {/* Header */}
            <div className="safe-top px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 max-w-md mx-auto mb-4">
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center haptic-active"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <X size={18} className="text-text-secondary" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-text-primary">수령 관리</h1>
                        <p className="text-xs text-text-muted">건별 수령 체크</p>
                    </div>
                </div>

                {/* Month nav */}
                <div className="flex items-center justify-between max-w-md mx-auto mb-4">
                    <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                        className="w-9 h-9 rounded-xl flex items-center justify-center haptic-active"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ChevronLeft size={18} className="text-text-secondary" />
                    </button>
                    <span className="text-base font-bold text-text-primary">{format(currentMonth, 'yyyy년 M월')}</span>
                    <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                        className="w-9 h-9 rounded-xl flex items-center justify-center haptic-active"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ChevronRight size={18} className="text-text-secondary" />
                    </button>
                </div>

                {/* Progress summary */}
                <div className="max-w-md mx-auto glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-xs text-text-muted">수령 완료</p>
                            <p className="text-xl font-black amount-display" style={{ color: '#10D9A0' }}>
                                {formatCurrency(totalReceived, userSettings.currency)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-text-muted">미수령</p>
                            <p className="text-xl font-black amount-display text-text-primary">
                                {formatCurrency(totalExpected, userSettings.currency)}
                            </p>
                        </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${rate}%`, background: 'linear-gradient(90deg, #10D9A0, #0BB882)' }} />
                    </div>
                    <p className="text-xs text-text-muted mt-1.5 text-center">{paidTasks.length} / {monthTasks.length}건 완료 ({rate}%)</p>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
                {monthTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>📋</div>
                        <p className="text-text-muted text-sm">이달의 일정이 없습니다</p>
                    </div>
                ) : (
                    <>
                        {unpaidTasks.length > 0 && (
                            <>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">미수령 ({unpaidTasks.length})</p>
                                {unpaidTasks.map(renderTask)}
                            </>
                        )}
                        {paidTasks.length > 0 && (
                            <>
                                <p className="text-xs font-bold uppercase tracking-wider mb-2 mt-4" style={{ color: '#10D9A0' }}>완료 ({paidTasks.length})</p>
                                {paidTasks.map(renderTask)}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
