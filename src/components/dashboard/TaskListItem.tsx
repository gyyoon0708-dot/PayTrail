import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { useStore } from '../../store';
import { cn, formatCurrency } from '../../lib/utils';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Bell, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface Props {
    task: Task;
    onEdit?: () => void;
}

const STATUS_CONFIG = {
    PAID: { dot: '#10D9A0', leftBorder: '#10D9A0', badge: 'badge-paid', label: '완료', bg: 'rgba(16,217,160,0.04)' },
    OVERDUE: { dot: '#FF6B6B', leftBorder: '#FF6B6B', badge: 'badge-overdue', label: '연체', bg: 'rgba(255,107,107,0.04)' },
    WAITING: { dot: '#F5C542', leftBorder: '#F5C542', badge: 'badge-waiting', label: '대기', bg: 'rgba(245,197,66,0.03)' },
    SCHEDULED: { dot: '#38BDF8', leftBorder: 'rgba(255,255,255,0.12)', badge: 'badge-scheduled', label: '예정', bg: 'transparent' },
};

export function TaskListItem({ task, onEdit }: Props) {
    const { userSettings, updateTask, deleteTask, subscription } = useStore();
    const { t } = useTranslation();
    const controls = useAnimation();
    const [isSwiping, setIsSwiping] = useState(false);

    const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.SCHEDULED;
    const isPaid = task.status === 'PAID';
    const isOverdue = task.status === 'OVERDUE';
    const net = task.amount - task.tax_deducted;
    const remaining = net - task.received_amount;

    const handlePay = () => {
        if (isPaid) return;
        if (userSettings.audioEnabled) {
            const audio = new Audio('/kaching.mp3');
            audio.play().catch(() => { });
        }
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10D9A0', '#0BB882', '#F5C542'] });
        updateTask(task.id, { status: 'PAID', received_amount: net, paid_date: new Date().toISOString() });
    };

    const handleUndoPay = () => {
        const dueDateObj = new Date(task.due_date);
        dueDateObj.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        let newStatus: TaskStatus = 'SCHEDULED';
        if (dueDateObj < today) newStatus = 'OVERDUE';
        else if (dueDateObj.getTime() === today.getTime()) newStatus = 'WAITING';
        updateTask(task.id, { status: newStatus, received_amount: 0 });
    };

    const onDragEnd = (_: any, info: PanInfo) => {
        setIsSwiping(false);
        if (!isPaid && info.offset.x > 100) handlePay();
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    };

    const handleRemind = () => {
        const template = subscription === 'PRO'
            ? t('proRemindTemplate').replace('{company}', task.company).replace('{dueDate}', task.due_date)
            : t('freeRemindTemplate').replace('{company}', task.company);
        navigator.clipboard.writeText(template + `\n\n${t('systemGeneratedMessage')}`)
            .then(() => alert(t('remindMessageCopied')));
    };

    return (
        <div className="relative rounded-[18px] overflow-hidden mb-3 animate-fade-in">
            {/* Swipe background */}
            {!isPaid && (
                <div className="absolute inset-0 flex items-center px-6 rounded-[18px]"
                    style={{ background: 'linear-gradient(135deg, #10D9A0 0%, #0BB882 100%)' }}>
                    <div className="flex items-center gap-2 text-bg-primary font-bold text-sm">
                        <span className="text-xl">✓</span>
                        <span>{t('markAsPaid')}</span>
                    </div>
                </div>
            )}

            <motion.div
                drag={isPaid ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 0.4 }}
                onDragStart={() => setIsSwiping(true)}
                onDragEnd={onDragEnd}
                animate={controls}
                className="relative rounded-[18px] overflow-hidden"
                style={{
                    background: `linear-gradient(145deg, rgba(26,34,53,0.95) 0%, rgba(15,22,42,0.98) 100%)`,
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset',
                }}
            >
                {/* Left status stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[18px]"
                    style={{ background: status.leftBorder }} />

                <div className="pl-4 pr-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                        {/* Left: info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                    'font-bold text-base leading-tight truncate',
                                    isPaid ? 'text-text-muted line-through' : 'text-text-primary'
                                )}>
                                    {task.company}
                                </h4>
                                <span className={cn('badge shrink-0', status.badge)}>{status.label}</span>
                            </div>

                            {task.work_date_start && (
                                <p className="text-xs text-text-muted mt-0.5">
                                    작업일: {task.work_date_start}
                                    {task.work_date_end && task.work_date_end !== task.work_date_start && ` ~ ${task.work_date_end}`}
                                </p>
                            )}
                            {task.memo && (
                                <p className="text-xs mt-1 line-clamp-1 italic" style={{ color: '#4B5F80' }}>{task.memo}</p>
                            )}
                        </div>

                        {/* Right: amount */}
                        <div className="text-right shrink-0">
                            <p className={cn(
                                'text-xl font-black amount-display leading-tight',
                                isOverdue ? 'text-danger' : isPaid ? 'text-primary-400' : 'text-text-primary'
                            )}>
                                {formatCurrency(isPaid ? (task.received_amount || net) : remaining, userSettings.currency)}
                            </p>
                            {task.received_amount > 0 && !isPaid && (
                                <p className="text-xs mt-0.5" style={{ color: '#F5C542' }}>
                                    부분: {formatCurrency(task.received_amount, userSettings.currency)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {!isPaid && (
                            <button
                                onClick={handlePay}
                                className="btn-primary flex-1 py-2 text-xs font-bold"
                            >
                                {t('quickPay')}
                            </button>
                        )}

                        {isOverdue && !isPaid && (
                            <button
                                onClick={handleRemind}
                                className="btn-danger flex items-center gap-1 px-3 py-2 text-xs"
                            >
                                <Bell size={12} />
                                {t('remind')}
                            </button>
                        )}

                        {isPaid && (
                            <button
                                onClick={handleUndoPay}
                                className="btn-secondary flex-1 py-2 text-xs"
                            >
                                {t('undoPayment')}
                            </button>
                        )}

                        <div className="flex gap-1.5 ml-auto">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all haptic-active"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    <Edit3 size={13} className="text-text-secondary" />
                                </button>
                            )}
                            <button
                                onClick={() => { if (window.confirm('삭제할까요?')) deleteTask(task.id); }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all haptic-active"
                                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)' }}
                            >
                                <Trash2 size={13} style={{ color: '#FF8080' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
