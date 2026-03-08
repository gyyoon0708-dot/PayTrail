import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Task, RecurringType } from '../../types';
import { X } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface Props {
    onClose: () => void;
    initialDate?: Date;
    editTaskId?: string;
}

export function TaskModal({ onClose, initialDate, editTaskId }: Props) {
    const { tasks, addTask, updateTask, draftTask, setDraftTask } = useStore();
    const { t } = useTranslation();

    const [company, setCompany] = useState('');
    const [amountStr, setAmountStr] = useState('');
    const [workDateStart, setWorkDateStart] = useState('');
    const [workDateEnd, setWorkDateEnd] = useState('');
    const [memo, setMemo] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringType, setRecurringType] = useState<RecurringType>('NONE');

    useEffect(() => {
        if (editTaskId) {
            const taskToEdit = tasks.find(t => t.id === editTaskId);
            if (taskToEdit) {
                setCompany(taskToEdit.company);
                setAmountStr(taskToEdit.amount.toString());
                setWorkDateStart(taskToEdit.work_date_start || '');
                setWorkDateEnd(taskToEdit.work_date_end || '');
                setMemo(taskToEdit.memo || '');
                setIsRecurring(taskToEdit.is_recurring);
                setRecurringType(taskToEdit.recurring_type);
                return;
            }
        }

        const todayStr = new Date().toISOString().split('T')[0];
        if (initialDate) {
            const dateStr = initialDate.toISOString().split('T')[0];
            setWorkDateStart(dateStr);
            setWorkDateEnd(dateStr);
        } else {
            setWorkDateStart(todayStr);
            setWorkDateEnd(todayStr);
        }

        if (draftTask) {
            setCompany(draftTask.company || '');
            setAmountStr(draftTask.amount?.toString() || '');
            setMemo(draftTask.memo || '');
            if (draftTask.work_date_start) setWorkDateStart(draftTask.work_date_start);
            if (draftTask.work_date_end) setWorkDateEnd(draftTask.work_date_end);
        }
    }, [initialDate, draftTask]);

    const handleClose = () => {
        setDraftTask({ company, amount: Number(amountStr), memo, work_date_start: workDateStart, work_date_end: workDateEnd });
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = Number(amountStr);
        // due_date defaults to work_date_end, or workDateStart, or today
        const dueDate = workDateEnd || workDateStart || new Date().toISOString().split('T')[0];

        if (editTaskId) {
            updateTask(editTaskId, {
                company,
                amount,
                tax_deducted: 0,
                due_date: dueDate,
                work_date_start: workDateStart || undefined,
                work_date_end: workDateEnd || undefined,
                is_recurring: isRecurring,
                recurring_type: isRecurring ? recurringType : 'NONE',
                memo,
            });
        } else {
            addTask({
                company,
                amount,
                tax_deducted: 0,
                received_amount: 0,
                status: 'SCHEDULED',
                due_date: dueDate,
                work_date_start: workDateStart || undefined,
                work_date_end: workDateEnd || undefined,
                is_recurring: isRecurring,
                recurring_type: isRecurring ? recurringType : 'NONE',
                memo,
            });
        }

        setDraftTask(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white border border-slate-200 w-full sm:max-w-md sm:rounded-2xl shadow-2xl flex flex-col rounded-t-2xl max-h-[92vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">{editTaskId ? t('editTask') : t('newTask')}</h2>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full haptic-active">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-4 overflow-y-auto">
                    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">

                        {/* Client / Company */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('clientCompany')}</label>
                            <input
                                required
                                type="text"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-base"
                                placeholder="클라이언트 또는 회사명"
                            />
                        </div>

                        {/* Amount — simple number */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('amount')}</label>
                            <input
                                required
                                type="number"
                                value={amountStr}
                                onChange={e => setAmountStr(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-base"
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        {/* Work Dates */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('workDate')}</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">시작일</p>
                                    <input
                                        type="date"
                                        value={workDateStart}
                                        onChange={e => {
                                            setWorkDateStart(e.target.value);
                                            // If end is empty or before start, sync end
                                            if (!workDateEnd || workDateEnd < e.target.value) {
                                                setWorkDateEnd(e.target.value);
                                            }
                                        }}
                                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-sm"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">종료일</p>
                                    <input
                                        type="date"
                                        value={workDateEnd}
                                        onChange={e => setWorkDateEnd(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Memo */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('memo')}</label>
                            <textarea
                                value={memo}
                                onChange={e => setMemo(e.target.value)}
                                rows={2}
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none shadow-sm text-sm"
                                placeholder="메모 (선택사항)"
                            />
                        </div>

                        {/* Recurring */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                                <input
                                    type="checkbox"
                                    checked={isRecurring}
                                    onChange={e => setIsRecurring(e.target.checked)}
                                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-slate-50 border-slate-300"
                                />
                                <span className="text-sm font-bold text-slate-700">{t('setRecurring')}</span>
                            </label>

                            {isRecurring && (
                                <select
                                    value={recurringType}
                                    onChange={e => setRecurringType(e.target.value as RecurringType)}
                                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                                >
                                    <option value="NONE" disabled>{t('none')}</option>
                                    <option value="WEEKLY">{t('weekly')}</option>
                                    <option value="MONTHLY">{t('monthly')}</option>
                                    <option value="MONTH_END">{t('monthEnd')}</option>
                                </select>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <button
                        type="submit"
                        form="task-form"
                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold haptic-active shadow-lg shadow-primary/20 text-base"
                    >
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
