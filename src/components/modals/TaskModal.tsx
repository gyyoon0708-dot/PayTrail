import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { taxUtils, cn } from '../../lib/utils';
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
    const [dueDate, setDueDate] = useState('');
    const [workDateStart, setWorkDateStart] = useState('');
    const [workDateEnd, setWorkDateEnd] = useState('');
    const [memo, setMemo] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringType, setRecurringType] = useState<RecurringType>('NONE');

    // Tax Calc Mode
    const [calcMode, setCalcMode] = useState<'GROSS' | 'NET'>('GROSS');

    // Load initial date and draft
    useEffect(() => {
        if (editTaskId) {
            const taskToEdit = tasks.find(t => t.id === editTaskId);
            if (taskToEdit) {
                setCompany(taskToEdit.company);
                setAmountStr(taskToEdit.amount.toString());
                setDueDate(taskToEdit.due_date);
                setWorkDateStart(taskToEdit.work_date_start || '');
                setWorkDateEnd(taskToEdit.work_date_end || '');
                setMemo(taskToEdit.memo || '');
                setIsRecurring(taskToEdit.is_recurring);
                setRecurringType(taskToEdit.recurring_type);
                return; // skip draft logic
            }
        }

        if (initialDate) {
            const dateStr = initialDate.toISOString().split('T')[0];
            setWorkDateStart(dateStr);
            setWorkDateEnd(dateStr);
            setDueDate('');
        } else {
            const dateStr = new Date().toISOString().split('T')[0];
            setWorkDateStart(dateStr);
            setWorkDateEnd(dateStr);
            setDueDate('');
        }

        if (draftTask) {
            setCompany(draftTask.company || '');
            setAmountStr(draftTask.amount?.toString() || '');
            setMemo(draftTask.memo || '');
            if (draftTask.work_date_start) setWorkDateStart(draftTask.work_date_start);
            if (draftTask.work_date_end) setWorkDateEnd(draftTask.work_date_end);
        }
    }, [initialDate, draftTask]);

    // Save draft on unmount (if not submitted)
    useEffect(() => {
        return () => {
            // Assuming unmount implies they closed it, unless we clear it.
            // Easiest is to save it always when unmounting, we will clear it inside handleSubmit.
        };
    }, []);

    const handleClose = () => {
        setDraftTask({ company, amount: Number(amountStr), memo, work_date_start: workDateStart, work_date_end: workDateEnd });
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const inputAmount = Number(amountStr);
        let grossAmount = inputAmount;
        let taxDeducted = 0;

        if (calcMode === 'NET') {
            grossAmount = Math.round(taxUtils.calculateGrossFromNet(inputAmount));
        }
        taxDeducted = Math.round(taxUtils.calculateTaxDeducted(grossAmount));

        if (editTaskId) {
            updateTask(editTaskId, {
                company,
                amount: grossAmount,
                tax_deducted: taxDeducted,
                due_date: dueDate,
                work_date_start: workDateStart || undefined,
                work_date_end: workDateEnd || undefined,
                is_recurring: isRecurring,
                recurring_type: isRecurring ? recurringType : 'NONE',
                memo
            });
        } else {
            addTask({
                company,
                amount: grossAmount,
                tax_deducted: taxDeducted,
                received_amount: 0,
                status: 'SCHEDULED', // Will be evaluated by engine to WAITING/OVERDUE as needed
                due_date: dueDate,
                work_date_start: workDateStart || undefined,
                work_date_end: workDateEnd || undefined,
                is_recurring: isRecurring,
                recurring_type: isRecurring ? recurringType : 'NONE',
                memo
            });
        }

        setDraftTask(null); // Clear draft on successful submit
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">{editTaskId ? t('editTask') : t('newTask')}</h2>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full haptic-active">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('clientCompany')}</label>
                            <input
                                required
                                type="text"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
                                placeholder=""
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-bold text-slate-700">{t('amount')}</label>
                                <div className="flex bg-slate-100 rounded-lg overflow-hidden border border-slate-200 p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setCalcMode('GROSS')}
                                        className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-colors", calcMode === 'GROSS' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                    >{t('calcGross')}</button>
                                    <button
                                        type="button"
                                        onClick={() => setCalcMode('NET')}
                                        className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-colors", calcMode === 'NET' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                                    >{t('calcNet')}</button>
                                </div>
                            </div>
                            <input
                                required
                                type="number"
                                value={amountStr}
                                onChange={e => setAmountStr(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
                                placeholder="0"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                {t('calcHint')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">{t('workDateStart')}</label>
                                <input
                                    type="date"
                                    value={workDateStart}
                                    onChange={e => setWorkDateStart(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">{t('workDateEnd')}</label>
                                <input
                                    type="date"
                                    value={workDateEnd}
                                    onChange={e => setWorkDateEnd(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm text-sm"
                                />
                            </div>
                        </div>
                        <p className="-mt-3 text-xs text-slate-500">
                            {t('workDateHint')}
                        </p>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('dueDate')}</label>
                            <input
                                required
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">{t('memo')}</label>
                            <textarea
                                value={memo}
                                onChange={e => setMemo(e.target.value)}
                                rows={3}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none shadow-sm"
                                placeholder=""
                            />
                        </div>

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
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
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

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <button
                        type="submit"
                        form="task-form"
                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold haptic-active shadow-lg shadow-primary/20"
                    >
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
