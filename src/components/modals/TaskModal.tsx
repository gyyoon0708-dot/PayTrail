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
            const d = initialDate.toISOString().split('T')[0];
            setWorkDateStart(d); setWorkDateEnd(d);
        } else {
            setWorkDateStart(todayStr); setWorkDateEnd(todayStr);
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
        const dueDate = workDateEnd || workDateStart || new Date().toISOString().split('T')[0];

        if (editTaskId) {
            updateTask(editTaskId, { company, amount, tax_deducted: 0, due_date: dueDate, work_date_start: workDateStart || undefined, work_date_end: workDateEnd || undefined, is_recurring: isRecurring, recurring_type: isRecurring ? recurringType : 'NONE', memo });
        } else {
            addTask({ company, amount, tax_deducted: 0, received_amount: 0, status: 'SCHEDULED', due_date: dueDate, work_date_start: workDateStart || undefined, work_date_end: workDateEnd || undefined, is_recurring: isRecurring, recurring_type: isRecurring ? recurringType : 'NONE', memo });
        }

        setDraftTask(null);
        onClose();
    };

    const labelCls = 'block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide';
    const inputCls = 'input-dark';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(5,8,20,0.7)', backdropFilter: 'blur(12px)' }}>
            <div className="w-full sm:max-w-md flex flex-col max-h-[92vh] animate-slide-up"
                style={{
                    background: 'linear-gradient(180deg, #1F2D42 0%, #111827 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -16px 60px rgba(0,0,0,0.5)',
                }}>
                {/* Handle */}
                <div className="flex justify-center pt-3">
                    <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3">
                    <h2 className="text-lg font-bold text-text-primary">{editTaskId ? t('editTask') : t('newTask')}</h2>
                    <button onClick={handleClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center haptic-active"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <X size={16} className="text-text-secondary" />
                    </button>
                </div>

                <div className="divider mx-5" />

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={labelCls}>{t('clientCompany')}</label>
                            <input required type="text" value={company} onChange={e => setCompany(e.target.value)}
                                className={inputCls} placeholder="클라이언트 / 회사명" />
                        </div>

                        <div>
                            <label className={labelCls}>{t('amount')}</label>
                            <input required type="number" value={amountStr} onChange={e => setAmountStr(e.target.value)}
                                className={`${inputCls} text-xl font-bold`} placeholder="0" min="0" />
                        </div>

                        <div>
                            <label className={labelCls}>작업 기간</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-text-muted mb-1">시작일</p>
                                    <input type="date" value={workDateStart}
                                        onChange={e => { setWorkDateStart(e.target.value); if (!workDateEnd || workDateEnd < e.target.value) setWorkDateEnd(e.target.value); }}
                                        className={inputCls} style={{ fontSize: 13 }} />
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted mb-1">종료일</p>
                                    <input type="date" value={workDateEnd} onChange={e => setWorkDateEnd(e.target.value)}
                                        className={inputCls} style={{ fontSize: 13 }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>{t('memo')}</label>
                            <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={2}
                                className={`${inputCls} resize-none`} placeholder="메모 (선택)" />
                        </div>

                        <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <label className="flex items-center gap-3 cursor-pointer mb-3">
                                <div
                                    onClick={() => setIsRecurring(!isRecurring)}
                                    className="w-11 h-6 rounded-full transition-all duration-200 flex items-center px-1 haptic-active"
                                    style={{ background: isRecurring ? '#10D9A0' : 'rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full transition-all duration-200"
                                        style={{ background: 'white', transform: isRecurring ? 'translateX(20px)' : 'translateX(0)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-text-secondary">{t('setRecurring')}</span>
                            </label>

                            {isRecurring && (
                                <select value={recurringType} onChange={e => setRecurringType(e.target.value as RecurringType)}
                                    className={inputCls}>
                                    <option value="NONE" disabled>{t('none')}</option>
                                    <option value="WEEKLY">{t('weekly')}</option>
                                    <option value="MONTHLY">{t('monthly')}</option>
                                    <option value="MONTH_END">{t('monthEnd')}</option>
                                </select>
                            )}
                        </div>
                    </form>
                </div>

                {/* Submit */}
                <div className="px-5 py-4 safe-bottom" style={{ background: 'rgba(10,15,30,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button type="submit" form="task-form" className="btn-primary w-full py-4 text-base font-bold">
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
}
