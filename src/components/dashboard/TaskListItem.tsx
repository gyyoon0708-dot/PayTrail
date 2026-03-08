import React, { useRef, useState } from 'react';
import { Task } from '../../types';
import { useStore } from '../../store';
import { cn, formatCurrency, PrivacyWrapper } from '../../lib/utils';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Bell, Edit3, Trash2 } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface Props {
    task: Task;
    onEdit?: () => void;
}

export function TaskListItem({ task, onEdit }: Props) {
    const { userSettings, updateTask, deleteTask, subscription } = useStore();
    const { t } = useTranslation();
    const controls = useAnimation();
    const [isSwiping, setIsSwiping] = useState(false);

    const isOverdue = task.status === 'OVERDUE';
    const isPaid = task.status === 'PAID';
    const remainingAmount = task.amount - task.tax_deducted - task.received_amount;

    const handlePay = () => {
        if (isPaid) return;

        // Play sound if enabled
        if (userSettings.audioEnabled) {
            // Basic beep fallback inside browser rules, or standard Audio object
            // In real scenario you would load an mp3 for 'Ka-ching'
            const audio = new Audio('/kaching.mp3');
            audio.play().catch(e => console.log('Audio play inhibited by browser until interaction:', e));
        }

        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3B82F6', '#10B981', '#FCD34D']
        });

        // Update state to FULL payment for simplicity on quick swipe
        updateTask(task.id, {
            status: 'PAID',
            received_amount: task.amount - task.tax_deducted,
            paid_date: new Date().toISOString()
        });
    };

    const handleUndoPay = () => {
        const dueDateObj = new Date(task.due_date);
        dueDateObj.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let newStatus: import('../../types').TaskStatus = 'SCHEDULED';
        if (dueDateObj < today) {
            newStatus = 'OVERDUE';
        } else if (dueDateObj.getTime() === today.getTime()) {
            newStatus = 'WAITING';
        }

        updateTask(task.id, {
            status: newStatus,
            received_amount: 0,
        });
    };

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsSwiping(false);
        if (!isPaid && info.offset.x > 100) {
            handlePay();
        }
        controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    };

    const handleRemindClick = () => {
        let remindText = '';
        if (subscription === 'PRO') {
            // Pro template
            remindText = t('proRemindTemplate')
                .replace('{company}', task.company)
                .replace('{dueDate}', task.due_date);
        } else {
            // Free template
            remindText = t('freeRemindTemplate')
                .replace('{company}', task.company);
        }

        remindText += `\n\n${t('systemGeneratedMessage')}`;

        navigator.clipboard.writeText(remindText).then(() => {
            alert(t('remindMessageCopied'));
        });
    };

    return (
        <div className="relative rounded-2xl overflow-hidden bg-success mb-2">
            {/* Background layer for Swipe action */}
            <div className="absolute inset-0 flex items-center px-6 bg-primary text-white font-bold opacity-90">
                <span className="text-lg">{t('markAsPaid')}</span>
            </div>

            {/* Foreground Draggable Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 0.5 }}
                onDragStart={() => setIsSwiping(true)}
                onDragEnd={onDragEnd}
                animate={controls}
                className={cn(
                    "relative bg-white border border-slate-200 border-l-4 rounded-2xl p-4 shadow-sm",
                    isOverdue ? "border-danger animate-pulse-soft bg-danger/5 border-l-danger" : "",
                    task.status === 'WAITING' ? "border-warning border-l-warning" : "",
                    isPaid ? "border-primary opacity-60 border-l-primary" : "",
                    task.status === 'SCHEDULED' ? "border-slate-300 border-l-slate-400" : ""
                )}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className={cn("font-bold text-lg", isPaid ? "line-through text-slate-400" : "text-slate-900")}>
                            {task.company}
                        </h4>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-xs text-slate-500 font-medium">{t('dueDate')}: {task.due_date}</p>
                            {task.work_date_start && (
                                <div className="text-xs text-blue-600 flex items-center gap-1 font-medium mt-0.5">
                                    <span className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-700">{t('workDate')}</span>
                                    {task.work_date_start}
                                    {task.work_date_end && task.work_date_end !== task.work_date_start && ` ~ ${task.work_date_end}`}
                                </div>
                            )}
                        </div>
                        {task.memo && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">{task.memo}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className={cn("text-xl font-black",
                            isOverdue ? "text-danger" : (isPaid ? "text-primary" : "text-slate-900"),
                            userSettings.privacyMode && "blur-privacy"
                        )}>
                            {PrivacyWrapper(formatCurrency(isPaid ? task.received_amount : remainingAmount, userSettings.currency), userSettings.privacyMode)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                            {task.received_amount > 0 && !isPaid ? `${t('partial')}: ${formatCurrency(task.received_amount, userSettings.currency)}` : (isPaid ? t('paid') : t('remaining'))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                    {!isPaid && (
                        <button
                            onClick={handlePay}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 text-xs font-bold rounded-lg transition-colors border border-slate-200 hover:border-primary/30"
                        >
                            {t('quickPay')}
                        </button>
                    )}

                    {isOverdue && !isPaid && (
                        <button
                            onClick={handleRemindClick}
                            className="flex items-center justify-center gap-1 flex-1 py-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white text-xs font-bold rounded-lg transition-colors border border-danger/20"
                        >
                            <Bell size={14} />
                            {t('remind')}
                        </button>
                    )}

                    {isPaid && (
                        <button
                            onClick={handleUndoPay}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 shadow-sm"
                        >
                            {t('undoPayment')}
                        </button>
                    )}

                    <div className="flex gap-1 ml-auto">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="p-1.5 text-slate-400 hover:text-primary bg-slate-50 hover:bg-primary/10 rounded-lg transition-colors border border-slate-200"
                                title={t('edit')}
                            >
                                <Edit3 size={16} />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (window.confirm(t('delete') + '?')) {
                                    deleteTask(task.id);
                                }
                            }}
                            className="p-1.5 text-slate-400 hover:text-danger bg-slate-50 hover:bg-danger/10 rounded-lg transition-colors border border-slate-200"
                            title={t('delete')}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
